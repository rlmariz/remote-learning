import numpy as np
import math
import time
import os
import sys
import inspect

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0, parentdir) 
from modbus_client import ModbusClient

class TankEnvirolment:
    def __init__(self):
        self.ref1 = 0
        self.ref2 = 0

        self.x1 = 0
        self.x2 = 0

        self.qe = 0
        self.vc = 0
        self.qc = 0
        self.vs = 100

        self.last_x1 = self.x1
        self.last_x2 = self.x2

        self.last_ref1 = self.ref1
        self.last_ref2 = self.ref2

        self.max_level = 12
        self.ts = 1

        self.controltype = 'pmc_nn'

        self.state_table = list(np.round(np.arange(-self.max_level, self.max_level + 0.01, 0.01), 2))

        self.action_table = list(np.round(np.arange(0, 1.1, 0.01), 2))

        self.num_states = len(self.state_table)
        self.num_actions = len(self.action_table)

        self.ModbusClient = ModbusClient(comm="tcp", host="192.168.68.150", port=502);

    def System_To_RL_State(self):
        state_x1 = np.round(self.x1 - self.ref1, 2)
        state_x1 = np.clip(state_x1, -self.max_level, self.max_level, out=None)
        state_index_x1 = self.state_table.index(state_x1)

        state_x2 = np.round(self.x2 - self.ref2, 2)
        state_x2 = np.clip(state_x2, -self.max_level, self.max_level, out=None)
        state_index_x2 = self.state_table.index(state_x2)

        return state_index_x1, state_index_x2
    
    def update_state(self):
        self.ModbusClient.read_data()
        self.x1 = self.ModbusClient.x1
        self.qe = self.ModbusClient.qe
        self.qc = self.ModbusClient.qc
        self.vc = self.ModbusClient.vc
        self.x2 = self.ModbusClient.x2
        self.qs = self.ModbusClient.qs
        self.vs = self.ModbusClient.vs
        self.ref1 = self.ModbusClient.ref1
        self.ref2 = self.ModbusClient.ref2
        self.controltype = "pmc_nn"
        if self.ModbusClient.controltype == 2:
           self.controltype = "pmc"
        if self.ModbusClient.controltype == 3:
           self.controltype = "rf"           

    def step(self, a1, a2):

        self.last_x1 = self.x1
        self.last_x2 = self.x2

        self.last_ref1 = self.ref1
        self.last_ref2 = self.ref2                

        # Getting the Actual action
        self.qe, self.vc = self.get_action(a1, a2)
        self.ModbusClient.qe = self.qe
        self.ModbusClient.vc = self.vc
        #print(a1)
        #print(self.qe)
        self.ModbusClient.write_data()

        # Finding the steady state of the system corresponding to the action 'A'
        #self.x1, self.qc = self.tank_rk(self.x1, self.qe, self.vc, self.k1, self.ts)
        #self.x2, self.qs = self.tank_rk(self.x2, self.qc, 100    , self.k2, self.ts)

        time.sleep(self.ts)
        
        # ver isso se tem que chamar antes
        self.update_state()

        reward1, reward2 = self.reward_calc()

        next_s1, next_s2 = self.System_To_RL_State()

        if self.state_table[next_s1] == 0 and self.state_table[next_s2] == 0:
            done = True
        else:
            done = False

        return next_s1, next_s2, reward1, reward2, done


    def get_action(self, a1, a2):
        '''
        Converts RL environment action to Actual system action.
        a: RL environment action (integer)
        return: Actual action (new input to the system)
        '''

        # Converting the delta u to actual input to be used for system
        # max operation insures that actual input to the system remains non negative
        #qe = self.qe + self.action_table[a]
        #qe = self.qe * (1 + self.action_table[a])

        #if a == 1:
        #   qe = self.qe * 1.1
        #elif a == 2:
        #   qe = self.qe * 0.9
        #else:
        #   qe = self.qe

        #qe = self.qe * self.action_table[a]
        #qe = self.action_table[a]
        qe = 4.0 * self.action_table[a1]
        qe = max(0, qe)
        qe = min(4, qe)

        vc = self.action_table[a2] * 100

        return qe, vc

    def reward_calc(self):
        '''
        Calculates the reward for reaching the state S
        S: Current actual state of the system
        return: Reward
        '''
        if self.ref1 != self.last_ref1:
          reward1 = 0;
        else:
          erro = abs(self.ref1 - self.x1)
          if erro < 0.1:
            reward1 = (0.1 - erro) * 10
          else:
            reward1 = 0

        if self.ref2 != self.last_ref2:
          reward2 = 0;
        else:
          erro = abs(self.ref1 - self.x1)
          if erro < 0.1:
            reward2 = (0.1 - erro) * 10
          else:
            reward2 = 0

        reward1 = abs(self.last_ref1 - self.last_x1) - abs(self.ref1 - self.x1)
        reward2 = abs(self.last_ref2 - self.last_x2) - abs(self.ref2 - self.x2)

        return reward1, reward2