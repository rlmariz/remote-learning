import numpy as np

class TankAgent:
    def __init__(self, alpha = 0.1, gamma = 0.9, epsilon = 1, num_states = None, num_actions = None):
        self.alpha = alpha;
        self.gamma = gamma;
        self.epsilon = epsilon;

        self.num_states = num_states
        self.num_actions = num_actions

        self.q_table_x1 = self.init_q_table();
        self.q_table_x2 = self.init_q_table();

    def e_greedy_policy(self, s1, s2):
        """
        This function performs the epsilon greedy action selection
        :param no_a: No. of actions available
        :param e: Exploration parameter
        :param q: Action value function for the current state
        :return: epsilon greedy action
        """
        if np.random.rand() < self.epsilon:
            a1 = np.random.randint(0, self.num_actions)
            a2 = np.random.randint(0, self.num_actions)
        else:
            a1 = np.argmax(self.q_table_x1[s1,:])
            a2 = np.argmax(self.q_table_x1[s2,:])

        return a1, a2

    def init_q_table(self, type="zeros"):
        '''
        This function initializes the table of Action-value function for each state and action.
        :param s: No. of states
        :param a: NO. of possible action available
        :param type: "zeros", "Ones", "Random"
        :return: s x a dimensional matrix for action value function Q(s, a).
        '''
        if type == "ones":
            q = np.ones((self.num_states, self.num_actions))

        if type == "zeros":
            q = np.zeros((self.num_states, self.num_actions))

        if type == "random":
            q = np.random.random((self.num_states, self.num_actions))

        return q

    def update_q_table_x1(self, s, a, reward, next_s):
        '''
        Q(s, a) = Q(s, a) + α * [R + γ * max(Q(s', a')) - Q(s, a)]

        Q(s, a) é o valor atual da tabela Q para o par estado-ação.
        α (alfa) é a taxa de aprendizado, que controla o quão rápido os valores da tabela Q são atualizados.
        R é a recompensa imediata recebida após a ação.
        γ (gama) é o fator de desconto que pondera a importância das recompensas futuras.
        max(Q(s', a')) é a estimativa do valor futuro do próximo estado s' e ação a'.
        '''
        max_a = np.argmax(self.q_table_x1[next_s,:])
        self.q_table_x1[s, a] += self.alpha * (reward + self.gamma * self.q_table_x1[next_s, max_a] - self.q_table_x1[s, a])

    def update_q_table_x2(self, s, a, reward, next_s):
        max_a = np.argmax(self.q_table_x2[next_s,:])
        self.q_table_x2[s, a] += self.alpha * (reward + self.gamma * self.q_table_x2[next_s, max_a] - self.q_table_x2[s, a])

    def save_q_table(self, name = 'Q_Mattrix'):
      np.savetxt(name+'_x1', self.q_table_x1)
      np.savetxt(name+'_x2', self.q_table_x2)

    def load_q_table(self, name = 'Q_Mattrix'):
      import os
      diretorio_atual = os.getcwd()
      print("Diretório atual:", diretorio_atual)
      self.q_table_x1 = np.loadtxt(name+'_x1')
      self.q_table_x2 = np.loadtxt(name+'_x2')