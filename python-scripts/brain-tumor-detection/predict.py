from tensorflow.keras import models
from tensorflow.keras.models import load_model
import sys
import tensorflow as tf
from tensorflow.keras.layers import Conv2D, Input, ZeroPadding2D, BatchNormalization, Activation, MaxPooling2D, Flatten, Dense
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.callbacks import TensorBoard, ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score
from sklearn.utils import shuffle
import cv2
import imutils
import numpy as np
import matplotlib.pyplot as plt
import time
from os import listdir
import os
#print(os.getcwd())
#sys.stdout.flush()
best_model = load_model(sys.argv[2])
#best_model = load_model(sys.argv[2])



def crop_brain_contour(image, plot=False):
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    thresh = cv2.threshold(gray, 45, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.erode(thresh, None, iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    c = max(cnts, key=cv2.contourArea)
    

    # Find the extreme points
    extLeft = tuple(c[c[:, :, 0].argmin()][0])
    extRight = tuple(c[c[:, :, 0].argmax()][0])
    extTop = tuple(c[c[:, :, 1].argmin()][0])
    extBot = tuple(c[c[:, :, 1].argmax()][0])
    
    # crop new image out of the original image using the four extreme points (left, right, top, bottom)
    new_image = image[extTop[1]:extBot[1], extLeft[0]:extRight[0]]            
    
    return new_image

def load_data(filename, image_size):
  
    
    X = []
    y = []
    image_width, image_height = image_size
    
    print(filename)
    image = cv2.imread(str(filename))
    print(image.shape)
    
    image = crop_brain_contour(image, plot=False)
            
    image = cv2.resize(image, dsize=(image_width, image_height), interpolation=cv2.INTER_CUBIC)
            
    image = image / 255.
    X.append(image)
   
                
    X = np.array(X)
    
    return X

file=sys.argv[1]
print(file)
testX=load_data(str(file),(240,240))
pred=best_model.predict(testX)

if(pred[0][0]>0.5):
    print('PREDICTION IS YES')
    sys.stdout.flush()
    #sys.exit(0)
	#print('CONFIDENCE= '+str(pred[0][0]*100) + '%')
else:
    print('PREDICTION IS NO')
    sys.stdout.flush()
	#print('CONFIDENCE= '+str(pred[0][0]*100)+'%')
