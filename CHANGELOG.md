# CHANGELOG

## V0.2.1
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
- LocalStorage & SessionStorage
