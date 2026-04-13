

export const debounce =(func, delay= 300)=>{
  let timer
  return function(data){
    clearTimeout(timer)
 timer= setTimeout(()=>{
    func(...data)
  },delay)
  }
}