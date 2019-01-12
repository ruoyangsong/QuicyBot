import requests
import sys

'''
To use the script:
input method is as follows:

[program name] "lyrics 1" "lyrics 2" "lyrics 3" ...

ex:
python3 Microsoft.py "my great lyrics 1" "my terrible lyrics 2"


will output 
0.9291588068008423 //first set of lyrics
0.1026400625705719 //second set of lyrics
etc

'''

def main():
	subscription_key = "a2ac1600950a4742b02c25d9d28b7ff2"
	sentiment_api_url = "https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment"

	#empty dictionary to start	
	documents = {'documents':[]}

	for argNum in range(1, len(sys.argv)):
		print(sys.argv[argNum])
		documents["documents"].append({
			'id':argNum,
			'language': 'en',
			'text': sys.argv[argNum]
			}
		)

	headers   = {"Ocp-Apim-Subscription-Key": subscription_key}
	response  = requests.post(sentiment_api_url, headers=headers, json=documents)
	sentiments = response.json()
	
	for argNum in range(len(sys.argv) - 1):
		print(sentiments["documents"][argNum]["score"])
	print(sentiments)

main()
