import requests
from flask_jsonpify import jsonify
from flask import Flask, request #import main Flask class and request object

'''
To use:
	run this app using python3
	should run on something like:
		http://127.0.0.1:5000/
	now you can query by doing the following:
		http://127.0.0.1:5000/query-lyric-sentiment?lyrics=hey%20there
'''

app = Flask(__name__) #create the Flask app

#API Key and website for query
subscription_key = "a2ac1600950a4742b02c25d9d28b7ff2"
sentiment_api_url = "https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment"


#host as a resource at http://127.0.0.1:5000/query-lyric-sentiment
@app.route('/query-lyric-sentiment')
def query_lyric_sentiment():

    #get lyrics from request
    lyrics = request.args.get("lyrics")

    #setup request with the lyrics
    documents = {'documents':[
        {"id":1, "language": "en", "text": lyrics}
    ]}

    #attach the proper headers
    headers   = {"Ocp-Apim-Subscription-Key": subscription_key}

    #fetch the response  
    response  = requests.post(sentiment_api_url, headers=headers, json=documents)
    
    #return the json object
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True, port=5000) #run app in debug mode on port 5000
