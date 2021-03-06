const path = require('path')

const PUBLIC_KEY =
  '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v2.6.2\r\nComment: https://openpgpjs.org\r\n\r\nxk0EWtpPiAEB/1DUOOu08SW7IGGlw5AavcxUxtrJbJVliIcFNSTpn/z/p0Zi\nIfO58AK0dfcHyMb1vUY8zwM45if6iaNS98zF3lEAEQEAAc0NPGluZm9AYnRs\nLmNvPsJ1BBABCAApBQJa2k+IBgsJBwgDAgkQjFLIxmtXVSMEFQgKAgMWAgEC\nGQECGwMCHgEAAIdvAf0SbWcBMphrR7wc6rL5ytyThLBsI72vz/0QyBcaRlsp\nQ9US66w6f+OWcpAiOeLDdx9l39difSXpjL9yYWxWRElSzk0EWtpPiAECAOpL\nfIIdC5S/lIaWI+Bx23FtSdxyqrKduDQCRDhB07udTv4bjGCSCtpyPS3Y03m6\nyl/GAa7OLIFeLzI4tzT0CXMAEQEAAcJfBBgBCAATBQJa2k+ICRCMUsjGa1dV\nIwIbDAAAxXwB/RUA88XTd6vDJDFeRx4/Escv5tyQuT9bxMkmSxaqiBRTU2X5\nhrFQs5NGOu2ySGbRvZMopK91sLK/uqlTaty1oVk=\r\n=yws5\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n'

const config = {
  // TODO: Ensure that at least one account chain is set as a peer
  peers: ['ib-dev----master.herokuapp.com'],
  adminValidators: [PUBLIC_KEY],
  staticChains: {
    // The public chain runs on the browser and is the entry point for the application
    templatePublic: {
      covenant: 'public',
      config: {
        validators: [PUBLIC_KEY],
        joins: {
          consume: [
            {
              alias: 'templateControl',
              path: ['interbitServices'],
              joinName: 'INTERBIT_SERVICES'
            }
          ]
        }
      }
    },
    // The control chain may contain sensitive application configuration. It runs
    // on validator nodes, but not on the browser.
    templateControl: {
      covenant: 'control',
      // If defaultChain = true, this chain is responsible for creating child chains
      defaultChain: true,
      config: {
        validators: [PUBLIC_KEY],
        joins: {
          provide: [
            {
              alias: 'templatePublic',
              path: ['interbitServices', 'shared'],
              joinName: 'INTERBIT_SERVICES'
            }
          ]
        }
      }
    }
    // Private chains are created dynamically and is not part of the initial configuration
  },
  covenants: {
    // All covenants used by the application, including covenants for
    // dynamically created chains
    public: {
      location: path.join(__dirname, 'src/interbit/public')
    },
    control: {
      location: path.join(__dirname, 'src/interbit/control')
    },
    private: {
      location: path.join(__dirname, 'src/interbit/private')
    }
  },
  apps: {
    template: {
      peers: ['ib-dev----master.herokuapp.com'], // the peers the browser should connect to
      chains: ['templatePublic'], // the chains that need to load in the browser
      appChain: 'templatePublic', // The chain that the static page is loaded on
      indexLocation: path.join(__dirname, 'public/index.html'), // the index.html to update with the app info
      buildLocation: path.join(__dirname, 'build/') // the location of the finished build to update
    }
  }
}

module.exports = config
