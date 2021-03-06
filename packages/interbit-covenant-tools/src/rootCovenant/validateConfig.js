const validateConfig = config => {
  const requiredProps = ['peers', 'chains', 'covenants']
  const allowedProps = requiredProps.concat('masterChain')

  validateRequiredProps(requiredProps, config)
  validateAllowedProps(allowedProps, config)

  Object.entries(config.chains).forEach(([chainAlias, chainConfig]) => {
    if (typeof chainConfig === 'string') {
      return
    }
    const referencedCovenant = chainConfig.covenant
    if (!referencedCovenant) {
      throw new Error(`"${chainAlias}" chain does not reference a covenant`)
    }

    const covenant = config.covenants[referencedCovenant]
    if (referencedCovenant && !covenant) {
      throw new Error(
        `"${chainAlias}" referenced covenant "${
          chainConfig.covenant
        }" but it is not configured`
      )
    }

    validateJoins(chainAlias, config)
  })

  validateMoleculeShape(config)

  return true
}

const joinTypes = {
  CONSUME: 'consume',
  PROVIDE: 'provide',
  RECEIVE: 'receiveActionFrom',
  SEND: 'sendActionTo'
}

const joinMap = {
  [joinTypes.CONSUME]: joinTypes.PROVIDE,
  [joinTypes.PROVIDE]: joinTypes.CONSUME,
  [joinTypes.RECEIVE]: joinTypes.SEND,
  [joinTypes.SEND]: joinTypes.RECEIVE
}

const validateJoins = (chainAlias, config) => {
  Object.values(joinTypes).forEach(type => {
    validateJoinType(type, chainAlias, config)
  })
}

const validateJoinType = (joinType, chainAlias, config) => {
  const joins = getChainJoins(chainAlias, config)
  if (!joins || !joins[joinType]) {
    return
  }

  joins[joinType].forEach(join => {
    if (typeof join.alias === 'undefined') {
      throw new Error(
        `"${joinType}" join in "${chainAlias}" chain is missing an alias`
      )
    }

    const joinedAlias = config.chains[join.alias]
    if (typeof joinedAlias === 'undefined') {
      throw new Error(
        `"${joinType}" join in "${chainAlias}" chain referenced "${
          join.alias
        }" but it is unconfigured`
      )
    }

    // Make sure the aliased chain has a corresponding join
    const aliasedChainConfig = config.chains[join.alias].config
    const correspondingJoinType = joinMap[joinType]

    if (
      !aliasedChainConfig ||
      !aliasedChainConfig.joins ||
      !aliasedChainConfig.joins[correspondingJoinType] ||
      !hasCorrespondingJoin(
        aliasedChainConfig,
        chainAlias,
        correspondingJoinType
      )
    ) {
      throw new Error(
        `"${chainAlias}" and "${
          join.alias
        }" do not have matching join configuration`
      )
    }

    validateJoinShape(joinType, join)
  })
}

const hasCorrespondingJoin = (
  aliasedChainConfig,
  chainAlias,
  correspondingJoinType
  // eslint-disable-next-line
) => aliasedChainConfig.joins[correspondingJoinType].some(
    join => join.alias === chainAlias
  )

const validateJoinShape = (joinType, join) => {
  let requiredProps
  switch (joinType) {
    case joinTypes.CONSUME: {
      requiredProps = ['alias', 'path', 'joinName']
      break
    }

    case joinTypes.PROVIDE: {
      requiredProps = ['alias', 'path', 'joinName']
      break
    }

    case joinTypes.RECEIVE: {
      requiredProps = ['alias', 'authorizedActions']
      break
    }

    case joinTypes.SEND: {
      requiredProps = ['alias']
      break
    }

    default:
      break
  }
  validateRequiredProps(requiredProps, join, 'join')
}

const getChainJoins = (chainAlias, config) => {
  const chainConfig = config.chains[chainAlias]
  if (!chainConfig || !chainConfig.config || !chainConfig.config.joins) {
    return undefined
  }
  return chainConfig.config.joins
}

const validateRequiredProps = (requiredProps, config, configType) => {
  const configMsg = configType ? `${configType} ` : ''
  requiredProps.forEach(prop => {
    if (typeof config[prop] === 'undefined') {
      throw new Error(`"${prop}" property is required in ${configMsg}config`)
    }
  })
}

const validateAllowedProps = (allowedProps, config) => {
  const unsupportedProps = Object.keys(config).filter(
    prop => allowedProps.indexOf(prop) === -1
  )
  if (unsupportedProps.length > 0) {
    throw new Error(
      `Config contains unsupported props: ${unsupportedProps.toString()}`
    )
  }
}

const validateMoleculeShape = config => {
  if (!config.masterChain) {
    // It's not important that the molecule be a tree if we won't be cascading changes
    return
  }

  const tree = {}
  const visited = []
  const chainsList = Object.entries(config.chains)
  buildChainTree(chainsList, tree, config.masterChain, visited)
}

const buildChainTree = (chains, tree, node, visited) => {
  if (visited.indexOf(node) !== -1) {
    throw new Error(
      `"${node}" cannot be added to manifest again: it is already a parent node`
    )
  }
  visited.push(node)

  // eslint-disable-next-line
  tree[node] = findChildren

  chains.forEach(([chainAlias, chainEntry]) => {
    if (chainEntry.parentChain === node) {
      buildChainTree(chains, tree[node], chainAlias, visited)
    }
  })
}

const findChildren = (chains, node) =>
  chains.reduce((foundLeaves, chain) => {
    const [chainAlias, chainEntry] = chain
    if (chainEntry.parentChain === node) {
      return { ...foundLeaves, [chainAlias]: {} }
    }
    return foundLeaves
  }, {})

const createManifest = config => {}

module.exports = {
  validateConfig,
  createManifest
}
