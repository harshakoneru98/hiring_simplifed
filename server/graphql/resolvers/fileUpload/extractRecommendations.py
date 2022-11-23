import pickle, sys
import numpy as np
from scipy import spatial

myskills = sys.argv[1]
sentence_embedder_pkl = sys.argv[2]
data_for_recommendation_pkl = sys.argv[3]
clustering_model_10_pkl = sys.argv[4]

def cosine(x2):
    global myskill_embedding
    return 1 - spatial.distance.cosine(x2,myskill_embedding)

def kmeans_predict(x):
    x = np.array([float(w) for w in x])
    return clustering_model.predict(x.reshape(1,384))

with open(sentence_embedder_pkl, "rb") as f:
    sentence_embedder = pickle.load(f)
    
with open(data_for_recommendation_pkl, "rb") as f1:
    data = pickle.load(f1)
    
with open(clustering_model_10_pkl, "rb") as f2:
    clustering_model = pickle.load(f2)

myskill_embedding = sentence_embedder.encode(', '.join(myskills))

predict_embed = myskill_embedding.reshape(1,384)
predicted_cluster = clustering_model.predict(np.array([float(w) for w in list(predict_embed[0])]).reshape(1,384))[0]

Mapping_table = {}
Mapping_table[0] =['Software Development Engineer','Product Manager','Data Engineer']
Mapping_table[1] =['Data Engineer','Data Scientist']
Mapping_table[2] =['Hardware Engineer','Product Manager']
Mapping_table[3] =['Business Analyst','Product Manager']
Mapping_table[4] =['Data Scientist','Business Analyst','Data Engineer']
Mapping_table[5] =['Data Engineer','Data Scientist']
Mapping_table[6] =['Product Manager','Business Analyst']
Mapping_table[7] =['Product Manager','Business Analyst']
Mapping_table[8] =['Product Manager','Business Analyst']
Mapping_table[9] =['Data Scientist','Data Engineer','Machine Learning Engineer']

my_job_families = Mapping_table[predicted_cluster]

data['similarity'] = data["embeddings"].apply(cosine)

data["embeddings_predict"] = data["embeddings"].apply(kmeans_predict)

top_100_recommendations = list(data[data['Job_family'].isin(my_job_families)].sort_values(['similarity'],ascending=False).head(100)['id'])

print(predicted_cluster)
for recommendation in top_100_recommendations:
    print(recommendation)