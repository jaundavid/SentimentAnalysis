import json
from pprint import pprint
import sys;
print sys.stdout.encoding


json_data=open('test.json')
data=json.load(json_data)
json_data.close()
data=data["feed"]
data=data["data"]
posts = dict()
outfile=open('corpus','w');
i = 0
for post in data:
    try:        
        outfile.write(post['message'].encode('utf-8'))
        comments = post['comments']
        comments = comments['data']
        for comment in comments:
            outfile.write(comment['message'].encode('utf-8'))
    except KeyError:
        print " "
outfile.close()

