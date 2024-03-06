Para modelar um sistema massa-mola-amortecedor com várias massas (n massas), podemos utilizar o conceito de sistemas acoplados. Nesse tipo de sistema, cada massa está ligada a uma mola e um amortecedor, e todas as massas estão conectadas entre si.

Vamos considerar um sistema com n massas, numeradas de 1 a n. A massa i está conectada à massa i+1 por uma mola com constante elástica ki e a um amortecedor com coeficiente de amortecimento ci. A massa 1 está fixa em uma posição fixa e a massa n está livre. As massas estão todas ao longo de uma linha reta.

A equação de movimento para a massa i pode ser escrita como:

m_i * d²x_i/dt² = -k_i * (x_i - x_i-1) - k_i+1 * (x_i - x_i+1) - c_i * (dx_i/dt - dx_i-1/dt) - c_i+1 * (dx_i/dt - dx_i+1/dt)

Onde:
- mi é a massa da partícula i,
- xi é a posição da partícula i,
- ki é a constante elástica da mola entre as partículas i e i-1,
- ci é o coeficiente de amortecimento entre as partículas i e i-1,
- dx_i/dt é a velocidade da partícula i (derivada da posição em relação ao tempo).

Para a primeira e última massa, as equações são simplificadas devido às condições de contorno. Para a primeira massa (i = 1), temos:

m_1 * d²x_1/dt² = -k_1 * (x_1 - x_0) - c_1 * (dx_1/dt - dx_0/dt)

Já para a última massa (i = n), temos:

m_n * d²x_n/dt² = -k_n * (x_n - x_n-1) - c_n * (dx_n/dt - dx_n-1/dt)

Essas equações diferenciais podem ser resolvidas numericamente usando métodos como o método de Euler ou o método de Runge-Kutta. É necessário fornecer as condições iniciais (posições e velocidades iniciais) para cada massa, bem como os valores das massas, constantes elásticas e coeficientes de amortecimento.

Dessa forma, é possível modelar um sistema massa-mola-amortecedor com várias massas acopladas. O comportamento do sistema dependerá das condições iniciais e dos parâmetros do sistema, como massas e constantes de mola e amortecimento.