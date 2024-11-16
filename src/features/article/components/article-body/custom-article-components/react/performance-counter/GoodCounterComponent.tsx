import { useState } from "react"

let rerenders = 0;
function getInitialValue() {
  console.log('getInitialValue');
  rerenders++ 
  return 0
}

export function GoodCounterComponent() {
  const [count, setCount] = useState(getInitialValue)
  
  return (
   <div>
        <div className="flex gap-8 mb-8">
            <button onClick={() => setCount(prev => prev - 1)}>Decrease Count</button>
            <span className="text-2xl">{count}</span>
            <button onClick={() => setCount(prev => prev + 1)}>Increase Count</button>
        </div>
      <div suppressHydrationWarning className="text-xl">The getInitialValue function has ran: {rerenders}</div>
    </div>
  )
}