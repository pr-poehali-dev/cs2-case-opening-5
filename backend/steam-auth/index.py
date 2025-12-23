import json
import os
import urllib.parse
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Аутентификация пользователей через Steam OpenID
    Args: event - запрос с методом GET/POST
    Returns: данные пользователя Steam или ссылку для авторизации
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        
        if 'openid.claimed_id' in params:
            steam_id = params['openid.claimed_id'].split('/')[-1]
            
            steam_api_key = os.environ.get('STEAM_API_KEY', '')
            if not steam_api_key:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'STEAM_API_KEY not configured'}),
                    'isBase64Encoded': False
                }
            
            api_url = f'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steam_api_key}&steamids={steam_id}'
            
            try:
                with urllib.request.urlopen(api_url) as response:
                    data = json.loads(response.read().decode())
                    
                    if data['response']['players']:
                        player = data['response']['players'][0]
                        user_data = {
                            'steamId': player['steamid'],
                            'name': player['personaname'],
                            'avatar': player['avatarfull'],
                            'profileUrl': player['profileurl']
                        }
                        
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps(user_data),
                            'isBase64Encoded': False
                        }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Steam API error: {str(e)}'}),
                    'isBase64Encoded': False
                }
        
        request_context = event.get('requestContext', {})
        base_url = os.environ.get('FUNCTION_URL', 'http://localhost')
        
        return_url = f"{base_url}?action=verify"
        
        steam_login_url = 'https://steamcommunity.com/openid/login?' + urllib.parse.urlencode({
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.mode': 'checkid_setup',
            'openid.return_to': return_url,
            'openid.realm': base_url,
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
        })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'loginUrl': steam_login_url}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
