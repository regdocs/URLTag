#!python3

import requests, time, json
import validators, binascii

URLTAG_API_URI = 'http://localhost:4000'
AUTH_TOKEN = r'auth123'


def generate_one():
    batch_name = input(
        ' Choose your batch_name (for e.g. MAILS-MARCH-13) or leave blank to use default: ')
    
    params = {
        'batch_name': batch_name.strip(),
        'nos': 1,
        'auth_token': AUTH_TOKEN
    }
    
    url = URLTAG_API_URI + '/urltag/generate'
    res = requests.get(url=url, params=params)
    
    res_data = res.json()
    if res_data['success']:
        print('\n [🗸] 1 tag(s) successfully created')
        time.sleep(0.5)
        print('\n [🗸] Payload: \n')
        print(res_data['payload']['tags'][0])

    else:
        print('\n [✗] Could not create tag: ', end='')
        print(res_data['message'])



def generate_many():
    batch_name = input(
        ' Choose your batch_name (for e.g. MAILS-MARCH-13) or leave blank to use default ("B{epoch}"): '
    )
    
    nos = input(
        '\n Enter the no. of tags you want to create, or leave blank to use minimum (1): '
    )
    
    params = {
        'batch_name': batch_name.strip(),
        'auth_token': AUTH_TOKEN
    }

    if int(nos) < 1:
        params['nos'] = 1 
    else: 
        params['nos'] = nos

    url = URLTAG_API_URI + '/urltag/generate'
    res = requests.get(url=url, params=params)
    
    res_data = res.json()
    if res_data['success']:
        x = params['nos']
        print(f'\n [🗸] {x} tag(s) successfully created')
        time.sleep(0.5)

        print('\n [🗸] Payload: \n')
        for i in res_data['payload']['tags']:
            print(i)

    else:
        print('\n [✗] Could not create tag: ', end='')
        print(res_data['message'])



def inspect_one():
    uri = input(
        ' Enter the URL tag you want to inspect: '
    )

    if not validators.url(uri):
        print('\n [✗] Invalid URL entered, try again')
        return

    uri = uri.strip().split('/')
    if uri[-1] == '':
        uri = uri[0:-1]
    
    batch_name = binascii.unhexlify(uri[-1].split('?k=')[0]).decode()
    batch_key = uri[-1].split('?k=')[1]

    uri = URLTAG_API_URI + f'/urltag/inspect/{batch_name}'
    res = requests.get(url=uri, params={ 'auth_token': AUTH_TOKEN })

    res_data = res.json()
    if res_data['success'] and res_data['payload'][batch_key]:
        print(f'\n [🗸] Record found: {res_data["payload"][batch_key]} hit(s)')
    
    else:
        print('\n [✗] Could not fetch hits: ', end='')
        print(res_data['message'])


def inspect_many():
    uri = URLTAG_API_URI + f'/urltag/inspect'
    res = requests.get(url=uri, params={ 'auth_token': AUTH_TOKEN })

    res_data = res.json()

    if res_data['success'] and len(res_data['payload']):
        x = res_data['message']
        print(f' [🗸] {x}\n')
        time.sleep(0.5)
        count = 0
        hmap = { }
        for i in res_data['payload']:
            if i != '_id':
                print(f' - [{count}] ' + i)
                hmap[count] = i
                count += 1
        print()

        ch = int(input(' Enter batch # to inspect: '))

        y = hmap[ch]
        uri = URLTAG_API_URI + f'/urltag/inspect/{y}'
        res = requests.get(url=uri, params={ 'auth_token': AUTH_TOKEN })

        res_data = res.json()
        if res_data['success'] and res_data['payload']:
            print(f'\n [🗸] Record found for {y}')
            time.sleep(0.5)

            print('\n [🗸] Hits: \n')

            count = 1
            b64_batch_name = binascii.hexlify(y.encode()).decode().upper()
            for key in res_data['payload']:
                if key != '_id':
                    value = res_data['payload'][key]
                    print(f' - ({count}) /urltag/emit/{b64_batch_name}', end='')
                    print(f'?k={key} --> {value} hit(s)')
                    count += 1
        
        else:
            print('\n [✗] Could not fetch hits: ', end='')
            print(res_data['message'])
    
    else:
        print(' [✗] Could not fetch batch record: ', end='')
        print(res_data['message'])



def main():
    print()
    print('===================================================')
    print('❚            [URLTag Inspector v1.0]             ❚')
    print('===================================================')
    
    while True:
        time.sleep(0.6)
        print()
        print('What would you like to do?')
        print(' (1) Generate a tag')
        print(' (2) Generate tags in bulk')
        print(' (3) Inspect hits from a tag')
        print(' (4) Inspect hits from a batch of tags')
        print(' (5) Quit inspector')
        print()
        print(' +> ', end='')

        ch = input()
        print()

        try:
            match int(ch):
                case 1:
                    generate_one()
                case 2:
                    generate_many()
                case 3:
                    inspect_one()
                case 4:
                    inspect_many()
                case 5:
                    print(' Exiting...')
                    time.sleep(0.4)
                    return
        except Exception as e:
            print(e)

if __name__ == "__main__":
    main()
