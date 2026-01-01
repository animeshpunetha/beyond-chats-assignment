# API Documentation

Base URL: `http://localhost:5000`

## Articles

### 1. Scrape Articles
Triggers the scraping process to fetch the latest articles from the configured source.

- **URL**: `/api/articles/scrape`
- **Method**: `POST`
- **Body**: None
- **Success Response**:
    - **Code**: 200 OK
    - **Content**:
      ```json
      {
        "message": "Scraping completed",
        "count": 5
      }
      ```
    - **Note**: Triggers the scraping of the 5 oldest pages (or configured amount) from the blog.

### 2. Get All Articles
Retrieves a list of all articles stored in the database.

- **URL**: `/api/articles`
- **Method**: `GET`
- **Success Response**:
    - **Code**: 200 OK
    - **Content**:
      ```json
      [
        {
          "_id": "651a...",
          "title": "Article Title",
          "url": "https://example.com/article",
          "content": "Original content...",
          "status": "completed",
          "publishedDate": "2023-01-01T00:00:00.000Z"
        },
        ...
      ]
      ```

### 3. Get Article by ID
Retrieves details of a specific article, including both original and AI-enhanced content.

- **URL**: `/api/articles/:id`
- **Method**: `GET`
- **URL Params**:
    - `id` (required): The MongoDB Object ID of the article.
- **Success Response**:
    - **Code**: 200 OK
    - **Content**:
      ```json
      {
        "_id": "651a...",
        "title": "Article Title",
        "url": "https://example.com/article",
        "content": "Original content...",
        "updatedContent": "AI Enhanced content...",
        "referenceLinks": [
           { "title": "Ref 1", "link": "https://..." }
        ],
        "status": "completed"
      }
      ```
    - **Error Response**:
      - **Code**: 404 Not Found
      - **Content**: `{ "message": "Article not found" }`
