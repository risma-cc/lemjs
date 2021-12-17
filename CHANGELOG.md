# CHANGELOG

## V0.4.0
### Changed
- HTTP: Refactor HttpClient

## V0.3.1 | 2021-12-08
### Fixed
- Code small
- HTTP: Deep merge request parameters and configs

## V0.3.0 | 2021-07-20
### Features
- HTTP: API supports path parameters in URL, e.g. /user/{id}
- HTTP: Interceptors of request, response and error
- HTTP: Mock is disabled when the enviroment MOCK is "none"

### Changed
- HTTP: HttpAPI extends HttpRequest
- HTTP: Mock skips only request and not response/error

### Fixed
- Model: Code small

### Removed
- Model: React useModel
- HTTP: The enviroment MOCK_DISABLED

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
