# URLTag
Custom tag analytics REST API for the web (generate URL tags and track in batches). API documentation for URLTag [`v0.5-beta.0`](https://github.com/jayzsh/URLTag/releases/tag/v0.5-beta.0) can be found in [`docs/api.md`](/docs/api.md). Create a fork for adding your own modifications.

<br />

# Synopsis

 - Start using nodemon in **development mode**
 
   ```sh
   npm run start:dev
   ```
 - Clean build folder (if present) and re-build with Typescript compiler

   ```
   npm run build
   ```
 - Build to **production** and run in **Node.js**

   ```
   npm run start
   ``` 
<br />

## Hello World:

 - `GET /` ➜ **[200 HTML]** URLTag version & release info; GitHub repository; API up-time

    Usage:
    ```sh
    curl -v "http://localhost:4000"
    ```

<br />

## API Status Check:
 - `GET /ping` ➜ **[200 Plain-text]** Status 200 accompanies "OK"
    
    Usage:
    ```sh
    curl -v "http://localhost:4000/ping"
    ```

<br />
    
## Generate Tracking URL (requires authorisation token):
 - `GET /urltag/generate` ➜ **[200 JSON]** Generate a new batch with the provided number of tracking URLs; tracking URL paths are of the format `*/urltag/emit/BATCH_NAME?k=TAG_KEY`
 
    Type | Field name | Info
    -----|------------|------
    @query | batch_name | title for the new batch; this is also the _id field for a document
    @query | nos        | the number of unique tracking URLs to add to the document; strictly a numeric param
    @query | auth_token | authorisation token from project `.env`
 
    Usage:
    ```sh
    curl -v -G "http://localhost:4000/urltag/generate" \
      --data-urlencode "batch_name=BATCH_NAME" \
      --data-urlencode "nos=NOS" \
      --data-urlencode "auth_token=AUTH_TOKEN"
    ```
 <br />
 
## Inspect hits (requires authorisation token):
    
 - `GET /urltag/inspect` ➜ **[200 JSON]** Returns a list of all batch `_id` fields in the database

    Type | Field name | Info
    -----|------------|------
    @query | auth_token | authorisation token from project `.env`
   
    Usage:
    ```sh
    curl -v -G "http://localhost:4000/urltag/inspect" \
      --data-urlencode "auth_token=AUTH_TOKEN"
    ```
    
<br />
    
 - `GET /urltag/inspect/BATCH_NAME` ➜ **[200 JSON]** Returns a list of all tags with their hit counts inside document with _id BATCH_NAME
    
    Type | Field name | Info
    -----|------------|------
    @param | batch_name | title for the new batch; this is also the _id field for a document
    @query | auth_token | authorisation token from project `.env`
    
    Usage:
    ```sh
    curl -v -G "http://localhost:4000/urltag/inspect/BATCH_NAME" \
      --data-urlencode "batch_name=BATCH_NAME" \
      --data-urlencode "nos=NOS" \
      --data-urlencode "auth_token=AUTH_TOKEN"
    ```

<br />

## Collect hits:
 - `GET /urltag/emit/BATCH_NAME` ➜ **[200 IMAGE/PNG]** Send a request for the tracking pixel with given key `k` inside batch with _id BATCH_NAME (increment hit +1 against tag)
 
    Type | Field name | Info
    -----|------------|------
    @param | batch_name | title for the new batch; this is also the _id field for a document
    @query | k          | hexadecimal key identifying a unique tag inside a batch

    Usage:
    ```sh
    curl -v -G "http://localhost:4000/urltag/emit/BATCH_NAME?k=TAG_KEY"
    ```    
