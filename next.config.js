module.exports = {
  experimental: {
    rewrites() {
      return [
        // Use rewrite to fetch a Firebase config file from Firebase Hosting
        // This only works `yarn dev` and does not works in production by `yarn export`
        {
          source: '/__/firebase/init.json',
          destination: 'http://localhost:5000/__/firebase/init.json'
        },
      ];
    },
  }
}

