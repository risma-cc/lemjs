# CHANGELOG

## V0.3.0
### Features
- HTTP: API supports path parameters in URL, e.g. /user/{id}

### Changed
- HTTP: HttpAPI extends HttpRequest

### Fixed
- Model: code small

## V0.2.1
### Features
- Storage: *remove*

### Changed
- Storage: *get* replaces *getString* and *getObject*

### Refactored
- HTTP: Check the enviroment NODE_ENV and MOCK_DISABLED

### Removed
- HTTP: *enableMock*
- Storage: *getString* and *getObject*

## V0.2.0 ｜ 2020-11-16
### Features
- AsyncFileReader
- HTTP: API's mock, *enableMock*

### Changed
- HTTP: The parameter *request* in *response* and *error* of API.

### Removed
- Model: put, loading

## V0.1.1 ｜ 2020-11-05
### Features
- Model: state, query, update, put (asynchronous actions), loading
- HTTP: API, client
- Storage: local storage and session storage
