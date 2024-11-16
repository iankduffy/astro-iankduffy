
export function CssVarButtons () {
  return (
    <div className='flex gap-2 justify-center w-full my-10 flex-wrap no-gap-x' style={{ '--gap': '0.5rem' } as React.CSSProperties}>
      <button className='button'>Basic Button</button>
      <button className='button success'>Submit Button</button>
      <button className='button danger'>Cancel Button</button>
      <button className='button brand'>Branded Button</button>
    </div>
  )
}