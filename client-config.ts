import { InMemoryCache } from "apollo-cache-inmemory";

export default function(){
	return {
    httpEndpoint: process.env.graphqlEndpoint,
    httpLinkOptions: {
      mode: 'cors'
    },
		cache: new InMemoryCache(),
		apollo: {
			defaultOptions: {
				watchQuery: {
					fetchPolicy: 'no-cache',
				},
				query: {
					fetchPolicy: 'no-cache',
				},
				mutate: {
					fetchPolicy: 'no-cache',
				},
			},
		}
	}
}