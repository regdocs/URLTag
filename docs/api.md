# API Documentation

API documentation for URLTag [`v0.5-beta.0`](https://github.com/jayzsh/URLTag/releases/tag/v0.5-beta.0) undiluted pre-release. Create a fork for adding your own modifications.

## Hello World:

 - `GET /` ➜ **[200 HTML]** URLTag version & release info; GitHub repository; API up-time
 
    ```sh
    curl -v "http://localhost:4000"
    ```


## API Status Check:
 - `GET /ping` ➜ **[200 Plain-text]** Status 200 accompanies "OK"
 
    ```sh
    curl -v "http://localhost:4000/ping"
    ```
    
    
## Generate Tracking URL (requires authorisation token):
 - `GET /urltag/generate` ➜ **[200 JSON]** Generate a new batch with the provided number of tracking URLs; tracking URL paths are of the format `*/urltag/emit/BATCH_NAME?k=TAG_KEY`
 
    ```dart
    @query  batch_name  "title for the new batch; this is also the _id field for a document"
    @query  nos         "the number of unique tracking URLs to add to the document; strictly a numeric param"
    @query  auth_token  "authorisation token from project .env"
    ```
    ```sh
    curl -v -G "http://localhost:4000/urltag/generate" --data-urlencode "batch_name=BATCH_NAME" --data-urlencode "nos=NOS" --data-urlencode "auth_token=AUTH_TOKEN"
    ```
    
    
 - `GET /urltag/inspect` ➜ **[200 JSON]** Returns a list of all batch `_id` fields in the database

    ```dart
    @query  auth_token  "authorisation token from project .env"
    ```
    ```sh
    curl -v -G "http://localhost:4000/urltag/inspect" --data-urlencode "auth_token=AUTH_TOKEN"
    ```
    
    
 - `GET /urltag/inspect/BATCH_NAME` ➜ **[200 JSON]** Returns a list of all tags with their hit counts inside document with _id BATCH_NAME
 
    ```dart
    @param  batch_name  "title for the new batch; this is also the _id field for a document"
    @query  auth_token  "authorisation token from project .env"
    ```
    ```sh
    curl -v -G "http://localhost:4000/urltag/inspect/BATCH_NAME" --data-urlencode "batch_name=BATCH_NAME" --data-urlencode "nos=NOS" --data-urlencode "auth_token=AUTH_TOKEN"
    ```
    
## Collect hits:
 - `GET /urltag/emit/BATCH_NAME` ➜ **[200 IMAGE/PNG]** Send a request for the tracking pixel with given key `k` inside batch with _id BATCH_NAME (increment hit +1 against tag)
 
    ```dart
    @param  batch_name  "title for the new batch; this is also the _id field for a document"
    @query  k           "hexadecimal key identifying a unique tag inside a batch"
    ```
    ```sh
    curl -v -G "http://localhost:4000/urltag/emit/BATCH_NAME?k=TAG_KEY"
    ```    
