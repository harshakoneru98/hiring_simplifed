from pdfminer.high_level import extract_text
from spacy.matcher import Matcher
from collections import defaultdict
import spacy, sys

input_file_path = sys.argv[1]

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

for skill in list(skills):
    print(skill)