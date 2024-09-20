import requests
import urllib
import jwt

def get_id_token(code):
   token_endpoint = 'https://oauth2.googleapis.com/token'
   payload = {
      'code': code,
      'client_id': '1065712212133-ti3o2vcejivl56g32gntu9g20tvbdr14.apps.googleusercontent.com',
      'client_secret': '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',
      'redirect_uri': 'postmessage',
      'grant_type': 'authorization_code'
   }

   body = urllib.parse.urlencode(payload)
   headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
   }

   response = requests.post(token_endpoint, data=body, headers=headers)

   if response.ok:
      id_token = response.json()['id_token']
      return jwt.decode(id_token, options={"verify_signature": False})
   
