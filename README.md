# Hiring Simplified
***DEMO*** 👉  [https://www.youtube.com/watch?v=sRBbdUnNt4U](https://www.youtube.com/watch?v=sRBbdUnNt4U)

## Project Goal
We have developed a Knowledge Graph based Job Search platform. Our platform is a one-stop solution for searching for open job positions, getting personalized job recommendations, and getting insights about specific job openings. We have also designed some high-impact visualizations related to skills and salary statistics. We developed a content-based Recommendation engine with features coming as high dimensional embeddings, which we developed by training a deep graph neural network.

## Research Questions
We have tried to prove there is an opportunity to convert natural language job descriptions into graphs of industry skills and use their trained graph embeddings in building a content-based recommendation Engine. Secondly, we have tried to create a knowledge graph that can answer reliable questions like ***“Top 10 skills for Amazon Data Scientist, Best Product Manager roles in Bay Area.”***

## Technical Challenge 1
### Problem
The main technical challenge we have tried to solve in the project is to build a content-based recommendation system. The features of this recommendation system are user profile & Job description KG embeddings which we obtain by treating user profile and job descriptions as graphs.
### Solution Approach
For generating embeddings, we thought of training a Graph neural network to predict job families given a graph of skills. Then we would later extract the last linear layer, which has 128 dimensions and use it as graph embedding of the job description.
### Steps followed
1. Extract skills from the job description, resolve them and generate a fully connected graph with node features as TF, IDF score of skill and edge feature as co-occurrence probability of two features
2. Train a deep GNN and predict the job family, which in our data has a cardinality of 7
3. Extract the linear layer for all jobs and store them as Job node property in our Knowledge Graph
4. For the use resume, generate user embedding and find the 100 nearest neighbors.
5. Validate results using 20 sample resumes and see if recommendations are aligned with user profiles.

### Evaluation
1. ***Model Evaluation:*** We compared our model results with a baseline model, which predicts everything as a product manager. ***Baseline Model Accuracy: 24% | Our Model Accuracy: 68%***
2. ***Recommendation Results Quality:*** We performed a User Acceptance Test with a sample size of 20. We found an overall acceptance of ~85% with a question size of 5

## Technical Challenge 2
### Problem
The time complexity of our initial recommendation system was  where n is the number of active graph nodes. Currently, we only have ~7300 nodes, and the time complexity is around 5 seconds, but in a real scenario, this number would be several hundred thousand. So we wanted to reduce it.
### Example
When the user resume is parsed, its vector representation gets generated, and we compare it against all 7300 node embeddings and find the top 100 embeddings with the highest cosine similarity. We duplicated the data 100 times for experimentation, and the time taken was around 1 minute.
### Solution Approach
We performed K-means clustering on Job Node embeddings and obtained the best K=9 using the elbow curve method. When user embedding gets generated, we first identify the user cluster and then find the best neighbors only from the job nodes that fall into that cluster. Time complexity got reduced from  to  , where k is the number of clusters and k>1 and n is the number of active graph job nodes. 
### Results
Our final product, where we used clustering, reduced the recommendation time from 5 seconds to less than 1 second.

## Application Architecture
![https://github.com/harshakoneru98/hiring_simplifed/blob/main/images/Architecture.png](https://github.com/harshakoneru98/hiring_simplifed/blob/main/images/Architecture.png)

## Setup
Get the code by cloning this repository using git
```
git clone https://github.com/harshakoneru98/hiring_simplifed.git
```
Once downloaded, open terminal in the project directory, go to app folder and install dependencies with:
```
npm install
```
Open another terminal in the project directory, go to server folder and install dependencies with:
```
npm install
```
Create **.env** file in server folder with the following attribute names:
```
AWS_ACCESS_KEY = <your_aws_access_key>
AWS_SECRET_KEY = <your_aws_secret_key>
AWS_REGION = <your_aws_region>
DATABASE_NAME = <your_dynamodb_database_name> Ex: 'user_data'
EMAIL_INDEX = <your_dynamodb_database_email_index_name> Ex: 'email-index'
AUTH_KEY = <your_auth_key> Ex: 'abc123'
RESUME_BUCKET = <your_image_s3_bucket_name> Ex: 'parse-job-resumes'
PYTHON_PATH = <your_python_path> Ex: '/opt/anaconda3/bin/python'
SERVER_URL = <your_graphql_server_url> Ex: 'http://localhost:4000/graphql'
NEO4J_USER = <your_neo4j_user> Ex: 'neo4j'
NEO4J_PASSWORD = <your_neo4j_password> Ex: 'your_password'
NEO4J_URI = <your_neo4j_URI> Ex: 'neo4j+s://9015cg79.databases.neo4j.io'
```
Install following python libraries
```
spacy
sentence_transformers
scipy
pickle
torch
```
## Run the Application
First open the terminal at app folder in project directory. Run the following command to run the front-end application.
``` bash
npm run start
```
Next open the terminal at server folder in project directory. Run the following command to run the back-end server.
``` bash
npm run start
```
The app should now be up and running at [http://localhost:3000](http://localhost:3000/)  🚀

## Learning from our Project
1. ***Web Scraping:*** LinkedIn doesn’t allow web scraping, so we had to learn Selenium for data scraping because it makes the website feel like a user is accessing their site using chrome. So It was excellent learning a new tool, debugging its errors and writing a process which extracts necessary information and handles errors gracefully.
2. ***Entity Resolution:*** We learnt a new approach to entity resolution where we explored using semantic word embeddings to estimate the cosine similarity
3. ***Graph Modeling:*** First, the challenge was generating graph embeddings for job descriptions, which will later act as item features in the literature on recommendation systems. To do that, we explored KGTK and Neo4j AuraDS frameworks. We could not use either because KGTK requires TensorFlow, and since we have an M1 chip MacBook, it was not compatible, and Neo4j AuraDS is a paid platform. For the modeling, we had to brainstorm a lot about how our graph would look and what node and edge features would be. After finishing this task, we gained understanding of different problems we can solve with this approach
4. ***Web Application Development:*** We finalized using the Neo4j database for the project. So, we choose to develop an application using GRAND stack, as it is easy to integrate Neo4j. For this, we have to learn GraphQL and Apollo Server. And the exciting learning is that we use GraphQL to query Neo4j instead of writing Cypher queries for simple tasks.
5. ***KG Quality assessment:*** Since evaluating KG quality is a subjective task, we brainstormed a lot on how we can access KG quality. We explored 4 dimensions in which we could access it like UAT, data checks. With our learnings from KG quality assessment, in future we would add predefined quality checks
