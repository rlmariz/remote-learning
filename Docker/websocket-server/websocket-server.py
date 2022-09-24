import random
from aiohttp import web
import socketio
import sympy
import json
import matplotlib.pyplot as plt
import base64
import io 

HOST = '0.0.0.0'
PORT = 2812

client_count = 0
a_count = 0
b_count = 0

s = sympy.symbols('s') 
t = sympy.symbols('t', positive=True)

print("WebSocket Service")

sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)

async def index(request):
    """Serve the client-side application."""
    print("index.html")
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

async def task(sid):
    await sio.sleep(5)
    result = await sio.call('mult', {'numbers': [3, 4]}, to=sid)
    print(result)


@sio.event
async def connect(sid, environ):
    global client_count
    global a_count
    global b_count

    username = environ.get('HTTP_X_USERNAME')
    print('username:', username)
    if not username:
        return False

    async with sio.session(sid) as session:
        session['username'] = username
    await sio.emit('user_joined', username)

    client_count += 1
    print(sid, 'connected')
    # sio.start_background_task(task, sid)
    await sio.emit('client_count', client_count)
    if random.random() > 0.5:
        sio.enter_room(sid, 'a')
        a_count += 1
        await sio.emit('room_count', a_count, to='a')
    else:
        sio.enter_room(sid, 'b')
        b_count += 1
        await sio.emit('room_count', b_count, to='b')

@sio.event
async def chat_message(sid, data):
    print("message ", data)

@sio.event
async def disconnect(sid):
    global client_count
    global a_count
    global b_count
    client_count -= 1
    print(sid, 'disconnected')
    await sio.emit('client_count', client_count)
    if 'a' in sio.rooms(sid):
        a_count -= 1
        await sio.emit('room_count', a_count, to='a')
    else:
        b_count -= 1
        await sio.emit('room_count', b_count, to='b')

    async with sio.session(sid) as session:
        await sio.emit('user_left', session['username'])    

@sio.event
async def sum(sid, data):
    result = data['numbers'][0] + data['numbers'][1]
    return {'result': result}

@sio.event
async def tfset(sid, data):
    print('tfset:', data)
    data['expression'] = sympy.parse_expr(data["func"])
    data['inverse_laplace'] = sympy.inverse_laplace_transform(data['expression'] , s, t)
    data['t'] = []
    data['y'] = []
    async with sio.session(sid) as session:
        session[data['name']] = data
    print('tfset', data);
    return {'result': True}

@sio.event
async def tfinput(sid, data):
    async with sio.session(sid) as session:
        tf = session[data['name']]
    data['y'] = tf['inverse_laplace'].subs(t, data['t']).evalf();

    async with sio.session(sid) as session:
        session[data['name']]['t'].append(data['t'])
        session[data['name']]['y'].append(data['y'])
    return json.loads(json.dumps(data, default=lambda x: eval(str(x))))

@sio.event
async def tfplot(sid, data):
    print('tfplott:', data)
    async with sio.session(sid) as session:
        tf = session[data['name']]

    print(tf)    
    
    plt.figure
    plt.clf()
    plt.plot(tf['t'], tf['y'], label='Saída')
    plt.xlabel('t')
    plt.ylabel('y')
    plt.title('Grafico de Saida: ' + tf['func'])
    plt.legend()
    plt.grid()

    # pic_IObytes = io.BytesIO()
    # plt.savefig(pic_IObytes,  format='png')
    # pic_IObytes.seek(0)
    # pic_hash = base64.b64encode(pic_IObytes.read())

    tf_name = tf['name'];
    file_name = f'./static/{tf_name}.png';
    
    plt.savefig(file_name)    

    return {'file_name': file_name}

app.router.add_static('/static', 'static')
app.router.add_get('/', index)

if __name__ == '__main__':
    print("WebSocket Service")
    web.run_app(app, host=HOST, port=PORT)