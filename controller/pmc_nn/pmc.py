import numpy as np
import keras
import tensorflow as tf
from keras import Sequential
from functools import partial
import numpy as np
import joblib
import math

tf.keras.backend.set_floatx('float64')
tf.keras.backend.clear_session()
np.random.seed(56)

class PMC:
    def __init__(self, data_dir="pmc_nn"):

        # Parametros Globais
        self.area = 16
        self.max_level = 12        
        self.k1 = 2
        self.k2 = 1
        self.ts = 1
        self.vs = 100
        self.horizon = 5
        self.num_data = 10000
        self.data_name = f"NumData-{self.num_data}_Hor-{self.horizon}_Ts-{self.ts}"

        self.data_dir = data_dir
        self.scaler_x_train = self.load_scaler();
        self.model = self.load_model()

    def load_model(self):

        json_file = open(f"{self.data_dir}/model.json", 'r')
        loaded_model_json = json_file.read()
        json_file.close()
        model = tf.keras.models.model_from_json(loaded_model_json)
        # load weights into new model
        model.load_weights(f"{self.data_dir}/model.weights.h5")
        print("Loaded model from disk")
        return model

    def load_scaler(self):
        scaler_x_train = joblib.load(f"{self.data_dir}/DataTrain_Scaler-x_{self.data_name}.pkl")
        return scaler_x_train

    def tank_xdot(self, x, qe, valve=100, valve_k = 1):
      if x >= 0:
        qs = valve_k * (valve / 100) * math.sqrt(x)
      else:
        qs = 0
      xd = (qe - qs) / self.area
      return xd, qs

    def tank_rk(self, x0, qe, valve=100, valve_k = 1, t=0.2):
      a=x0
      b=qe
      c=valve
      #call 1
      xd, qs = self.tank_xdot(x0, qe, valve, valve_k);
      savex0 = x0;
      phi = xd;
      x0 = savex0 + 0.5 * t * xd;

      #call two
      xd, qs = self.tank_xdot(x0, qe, valve, valve_k);
      phi = phi + 2 * xd;
      x0 = savex0 + 0.5 * t * xd;

      #call three
      xd, qs = self.tank_xdot(x0, qe, valve, valve_k);
      phi = phi + 2 * xd;
      x0 = savex0 + t * xd;

      #call four
      xd, qs = self.tank_xdot(x0, qe, valve, valve_k);
      x = savex0 + (phi + xd) * t / 6;

      if x < 0:
        x = 0

      if x > self.max_level:
        x = self.max_level

      if np.isnan(x):
        x = 0

      if np.isnan(qs):
        qs = 0

      return x, qs;

    def pmc_error(self, qe, vc, vs, x1, x2, ref1, ref2):

        pred_x = np.array([[x1, qe, vc, x2, vs]])
        pred_x = self.scaler_x_train.transform(pred_x)
        pred_y = self.model.predict(pred_x, verbose = None);

        if qe > 0 or vc > 0:
            x1 += pred_y[0][0]

        if vc > 0 or vs > 0:
            x2 += pred_y[0][1]

        error1 = np.sqrt(((x1 - ref1) ** 2))
        error2 = np.sqrt(((x2 - ref2) ** 2))
        error = error1 + error2

        return error1, error2, error;

    def pmc_error_modelo(self, qe, vc, vs, x1, x2, ref1, ref2, horizon=10):
        pred_history = np.zeros((0,5))

        for j in range(horizon):

            ref_horizon1 = np.ones((horizon,1)) * ref1
            ref_horizon2 = np.ones((horizon,1)) * ref2

            x1, qc = self.tank_rk(x1, qe, vc, self.k1, self.ts);
            x2, qs = self.tank_rk(x2, qc, vs, self.k2, self.ts);

            pred_history = np.vstack((pred_history, (qe, vc, vs, x1, x2)))

        error1 = np.sqrt(((pred_history[:,3] - ref_horizon1) ** 2).mean())
        error2 = np.sqrt(((pred_history[:,4] - ref_horizon2) ** 2).mean())
        error = error1 + error2

        return error1, error2, error;

    def pmc_control(self, qe, vc, vs, x1, x2, ref1, ref2, horizon=10, num_randactions=10, control_nn=True):
        # Parametros MPC
        max_delta_qe = 1
        max_qe = 4
        min_qe = 0

        max_delta_vc = 50
        max_vc = 100
        min_vc = 0

        best_qe = qe
        best_vc = vc

        error_nn1, error_nn2, error_nn = self.pmc_error(qe, vc, vs, x1, x2, ref1, ref2)
        #error_nn1 = error_nn2 = error_nn = 0
        error_model1, error_model2, error_model = self.pmc_error_modelo(qe, vc, vs, x1, x2, ref1, ref2, horizon)

        if control_nn:
            min_error1 = error_nn1
            min_error2 = error_nn2
            min_error = error_nn
        else:
            min_error1 = error_model1
            min_error2 = error_model2
            min_error = error_model

        # Faz um loop com a quantidade num_randactions de ações aleatorias
        for i in range (num_randactions):

            action_qe = qe
            action_vc = vc

            #Seleciona um delta aleatório para aplicar na nova ação
            action_qe += max_delta_qe * np.random.uniform(-1, 1)

            if action_qe > max_qe:
                action_qe = max_qe

            if action_qe < min_qe:
                action_qe = min_qe

            action_vc += max_delta_vc * np.random.uniform(-1, 1)

            if action_vc > max_vc:
                action_vc = max_vc

            if action_vc < min_vc:
                action_vc = min_vc

            error_nn1, error_nn2, error_nn = self.pmc_error(action_qe, action_vc, vs, x1, x2, ref1, ref2)            
            error_model1, error_model2, error_model = self.pmc_error_modelo(action_qe, action_vc, vs, x1, x2, ref1, ref2, horizon)

            if control_nn:
                error1 = error_nn1
                error2 = error_nn2
                error = error_nn
            else:
                error1 = error_model1
                error2 = error_model2
                error = error_model

            #print([error , min_error, action_qe, action_vc])
            if error < min_error:
                best_qe = action_qe
                best_vc = action_vc
                return best_qe, best_vc

        return best_qe, best_vc


# print("Versão do Keras:", keras.__version__)
# print("Versão do TensorFlow:", tf.__version__)
# import sys
# print("Versão do Python:", sys.version)

# x1 = 5.7
# x2 = 6.41
# qe = 2.34
# vc = 52
# vs = 100
# ref1=6
# ref2=6

# control = PMC()

# em1, em2, em = control.pmc_error_modelo(qe, vc, 100, x1, x2, 6, 6, horizon=5)
# print([em1, em2, em])

# en1, en2, en = control.pmc_error(qe, vc, 100, x1, x2, 6, 6)
# print([en1, en2, en])

# pred_x = np.array([[x1, qe, vc, x2, vs]])
# pred_x = control.scaler_x_train.transform(pred_x)
# pred_y = control.model.predict(pred_x, verbose = None);
# x1 += pred_y[0][0]
# x2 += pred_y[0][1]
# error1 = np.sqrt(((x1 - ref1) ** 2))
# error2 = np.sqrt(((x2 - ref2) ** 2))
# error = error1 + error2
# print([error1, error2, error])

# qe, vc = control.pmc_control(2.48, 52, 100, x1, x2, 6, 6, num_randactions = 10, control_nn=True)
# print([qe, vc])