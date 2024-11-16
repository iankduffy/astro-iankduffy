import CSS from './styles.module.scss'
export function CssVarButtons () {
  return (
    <div className={CSS.container}>
      <button className='button'>Basic Button</button>
      <button className='button success'>Submit Button</button>
      <button className='button danger'>Cancel Button</button>
      <button className='button brand'>Branded Button</button>
    </div>
  )
}