const ROOT_STATE_SLICE = 'interbitRoot'
const ROOT = 'root'
const CONFIG = 'config'
const COVENANTS = 'covenants'
const COVENANT_HASH = 'covenantHash'
const CHAINS = 'chains'
const CHAIN_ID = 'chainId'
const MANIFEST = 'manifest'
const MANIFEST_HASH = 'manifestHash'
const ACL = 'acl'

const FILE_LAYER = 'fileLayer'
const FILE_LAYER_DIRECTORY = 'directory'
const FILE_LAYER_CONTENT = 'contentToBeHoistedByCore'
const FILE_LAYER_TEMP_SPACE = 'contentToBeHoistedByCoreTmpSpace'

const PATHS = {
  MANIFEST: [ROOT_STATE_SLICE, MANIFEST],
  MANIFEST_CONFIG: [ROOT_STATE_SLICE, MANIFEST, CONFIG],
  MANIFEST_CHAINS: [ROOT_STATE_SLICE, MANIFEST, CONFIG, CHAINS],
  MANIFEST_COVENANTS: [ROOT_STATE_SLICE, MANIFEST, CONFIG, COVENANTS],

  FILE_LAYER: [ROOT_STATE_SLICE, FILE_LAYER],
  FILE_LAYER_CONTENT: [ROOT_STATE_SLICE, FILE_LAYER, FILE_LAYER_CONTENT],
  FILE_LAYER_DIRECTORY: [ROOT_STATE_SLICE, FILE_LAYER, FILE_LAYER_DIRECTORY],
  FILE_LAYER_TEMP_SPACE: [ROOT_STATE_SLICE, FILE_LAYER, FILE_LAYER_TEMP_SPACE]
}

module.exports = {
  PATHS,
  ROOT_STATE_SLICE,
  ROOT,
  CONFIG,
  COVENANTS,
  COVENANT_HASH,
  CHAINS,
  CHAIN_ID,
  MANIFEST,
  MANIFEST_HASH,
  ACL
}
