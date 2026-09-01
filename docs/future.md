# Features Not Yet Implemented

## Server
- Extending the `createRouter` wrapper function to accept `inputDto` and `outputDto` taking the responsibility of validating the input and output of each route handler. currently, input and output validation is handled explicitly in the route handler function which is redundant and repetitive.
- Allow `translator` service to run recursively depending on a depth argument. currently the service layer takes the responsibility of translating entity before returning it to the api layer.
- Extend list options to include `sort` object which then gets processed by the `listQueryBuilder` service to build order object of `typeorm`.
- Add Blog feature

## Client
- Extend the `EntityListDataTable` component to build filter, sorting, and searching functionalities dynamically from the given zod schema
- Add Blog UI
