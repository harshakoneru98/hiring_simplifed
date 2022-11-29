from sentence_transformers import SentenceTransformer, util
from pdfminer.high_level import extract_text
from spacy.matcher import Matcher
from collections import defaultdict
import spacy, sys, json, torch, pickle

input_file_path = sys.argv[1]
skill_embeddings_file_path = sys.argv[2]
sentence_embedder_pkl = sys.argv[3]

with open(sentence_embedder_pkl, "rb") as f:
    model = pickle.load(f)

with open(skill_embeddings_file_path, 'r') as f:
    skills_data_embeddings = json.load(f)

def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)

def preprocessMatchOutput(indexes):
    middle_indexes = defaultdict(list)

    for k, v in indexes:
        middle_indexes[k].append(v)

    middle_indexes = {k: max(v) for k, v in middle_indexes.items()}
    indexes = list(middle_indexes.items())

    middle_indexes = defaultdict(list)
    for k, v in indexes:
        middle_indexes[v].append(k)

    middle_indexes = {min(v):k for k, v in middle_indexes.items()}
    indexes = list(middle_indexes.items())
    
    return indexes

output = extract_text_from_pdf(input_file_path).replace('\n',' ').replace('\t',' ')
nlp = spacy.load("en_model_ner_skills")
doc = nlp(output)

patterns = [
    [{'ENT_TYPE': 'SKILL', 'OP': '+'}]
]
    
matcher = Matcher(nlp.vocab)
matcher.add("skills", patterns)
matches = matcher(doc)

indexes = [match[1:] for match in matches]
indexes = preprocessMatchOutput(indexes)

skills = set()
for (start,end) in indexes:
    skills.add(str(doc[start:end]).strip())
skills = list(skills)

new_skills_embeddings = model.encode(skills, convert_to_tensor=True).tolist()
new_skills_dict = {}

for i, skill in enumerate(skills):
    new_skills_dict[skill] = new_skills_embeddings[i]

total_skills_len = len(skills_data_embeddings.keys())
total_skills = list(skills_data_embeddings.keys())
new_skills = set()
for skill in skills:
    skill_embedding = model.encode(skill).tolist()
    embeddings1 = torch.Tensor([skill_embedding] * total_skills_len)
    embeddings2 = torch.Tensor(list(skills_data_embeddings.values()))
    
    cosine_scores = util.cos_sim(embeddings1, embeddings2).tolist()
    max_score = max(cosine_scores[0])
    if max_score > 0.6:
        max_score_skill = total_skills[cosine_scores[0].index(max_score)]
        new_skills.add(max_score_skill)

for skill in new_skills:
    print(skill)