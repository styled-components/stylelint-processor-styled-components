// asyncGenerators
async function* test(x) {
  // objectRestSpread
  const a = {}
  x = { x, ...a }

  // dynamicImport
  const b = import('./somewhere')

  // optionalCatchBinding
  try {
    throw 0
  } catch {
    x = 1
  }
  
  // optionalChaining
  const op = x?.a

  // nullishCoalescingOperator
  x = x ?? 42
}
