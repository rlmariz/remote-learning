import time
from reinforcment_learning.envirolment import TankEnvirolment
from reinforcment_learning.agent import TankAgent
from pmc_nn.pmc import PMC

if __name__ == "__main__":        
    print("inicio")

    epsilon = 0.1

    env = TankEnvirolment()
    agent = TankAgent(alpha = 0.1, gamma = 0.9, epsilon = epsilon, num_states = env.num_states, num_actions = env.num_actions)
    agent.load_q_table('reinforcment_learning/Q_Mattrix')

    pmc = PMC();

    last_s1, last_s2 = env.System_To_RL_State()

    while True:        

        if env.controltype == 'rf':
            
            s1, s2 = env.System_To_RL_State()
            
            a1, a2 = agent.e_greedy_policy(s1,s2)    

            next_s1, next_s2, reward1, reward2, done = env.step(a1, a2)

            agent.update_q_table_x1(s1, a1, reward1, next_s1)            
            agent.update_q_table_x2(s2, a2, reward2, next_s2)
            
            last_s1, last_s2 = s1, s2                                

            qe = env.qe
            vc = env.vc
        else:
            env.update_state() 

            if  env.controltype == 'pmc':
                qe, vc = pmc.pmc_control(env.qe, env.vc, env.vs, env.x1, env.x2, env.ref1, env.ref2, num_randactions = 5, control_nn=False)
            else:
                qe, vc = pmc.pmc_control(env.qe, env.vc, env.vs, env.x1, env.x2, env.ref1, env.ref2, num_randactions = 5, control_nn=True)

            env.ModbusClient.qe = qe
            env.ModbusClient.vc = vc
            env.ModbusClient.write_data()

            time.sleep(env.ts)
                    
        print([round(qe, 3), round(vc, 3), env.controltype])
        

    
    