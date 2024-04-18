export function notifyMessage(notify: string) {
  console.log('notify');
  
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification')
  } else if (Notification.permission === 'granted') {
    const notification = new Notification(notify)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      console.log('permission', permission);
      
      if (permission === 'granted') {
        const notification = new Notification(notify)
      }
    })
  }
}


