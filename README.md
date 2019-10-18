# Applitools Asserter

## Concept

Applitools is a great tool but is hard to run in CI due to it's limited integrations.

This tools aims to make integrations Applitools easier by returning information on a batch ID and can used as a branch policy on azure dev ops.

this has been built to run on an Azure function.

All you need to do is hit the deployed api with the following.

`?batchKey=applitoolsApiKey`
`?`

## Installing dependancies
`yarn`

## Running Tests
`yarn test`

##
