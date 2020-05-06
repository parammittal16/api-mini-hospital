#!/usr/bin/env python
# coding: utf-8

# In[79]:


import pickle
import sys


model = pickle.load(open(sys.argv[1], 'rb'))


# In[80]:


features=[]
feature=[]
for i in range(132):
    features.append(0)


# In[81]:


features_array=[features]


# In[82]:


def make_features(feature,feature_array):
    print("Features are : "+str(feature))
    for i in feature:
        for ind,j in enumerate(feature_array[0]):
            if(int(i)==ind):
                feature_array[0][ind]=1
    return features_array
                
    


# In[83]:


for i in sys.argv[2:]:
    feature.append(i)


# In[84]:


feat=make_features(feature,features_array)
print(feat)


# In[85]:


pred=model.predict(feat)


# In[86]:


print(pred)



# In[ ]:




