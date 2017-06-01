
import json
import os
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='public')


@app.route('/load', methods=['GET'])
def load():
    with open('data.json', 'r') as f:
        data = json.loads(f.read())

    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/move', methods=['POST'])
def move():
    with open('data.json', 'r') as f:
        data = json.loads(f.read())

    body = request.data.decode('utf-8')
    body_data = json.loads(body)

    types = ['todo', 'done']
    if body_data['type'] == types[0]:
        from_key_name = '{}_list'.format(types[0])
        to_key_name = '{}_list'.format(types[1])
    elif body_data['type'] == types[1]:
        from_key_name = '{}_list'.format(types[1])
        to_key_name = '{}_list'.format(types[0])
    else:
        return Response(status=400)

    for i, t in enumerate(data[from_key_name]):
        if t['id'] == body_data['id']:
            task = t
            del data[from_key_name][i]
            data[to_key_name].append(task)
            break
    else:
        return Response(status=404)

    with open('data.json', 'w') as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False))

    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/delete', methods=['POST'])
def delete():
    with open('data.json', 'r') as f:
        data = json.loads(f.read())

    body = request.data.decode('utf-8')
    body_data = json.loads(body)

    list_name = '{}_list'.format(body_data['type'])
    for i, t in enumerate(data[list_name]):
        if t['id'] == body_data['id']:
            del data[list_name][i]
            break
    else:
        return Response(status=404)

    with open('data.json', 'w') as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False))

    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/add', methods=['POST'])
def add():
    body = request.data.decode('utf-8')
    body_data = json.loads(body)

    with open('data.json', 'r') as f:
        data = json.loads(f.read())

    with open('data.json', 'w') as f:
        import time
        added_task = {'id': time.time(), 'title': body_data['text']}
        data['{}_list'.format(body_data['type'])].append(added_task)
        f.write(json.dumps(data, indent=2, ensure_ascii=False))

    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 5000)), debug=True)
