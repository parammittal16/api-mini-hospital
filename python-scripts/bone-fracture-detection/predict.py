from keras.models import load_model,Model
from keras.preprocessing.image import ImageDataGenerator, load_img,img_to_array
import sys
import numpy as np

#from keras.applications.densenet import DenseNet169
##from keras.layers import Dense
#from keras.optimizers import Adam

#bonemodel=DenseNet169(include_top=True,weights='imagenet')
#bonemodel.layers.pop()
#predictions = Dense(1, activation='sigmoid')(bonemodel.layers[-1].output)
#model = Model(inputs=bonemodel.input, outputs=predictions)

#model.compile(optimizer = Adam(lr=0.0001), loss='binary_crossentropy', metrics=['accuracy'])
#model.load_weights('weights.hdf5')
#print('Loaded')
#model.save('model.h5')

model=load_model(sys.argv[2])
print('\n Model loaded \n')
filename=sys.argv[1]
img = load_img(filename,target_size=(224,224))
print('Image loaded.. \n')
img=img_to_array(img)
predimg=[]
predimg.append(img)
predimg=np.array(predimg)
pred=model.predict(predimg)
if (pred[0]>0.5):
	print('Bone Abnormal')
else:
	print('Bone Normal')
