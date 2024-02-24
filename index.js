const DECISION = 100
let isAnimated = false
let distance = 0

function starDrag(e) {
  if (isAnimated) return

  const actualCard = e.target.closest('article')
  if (!actualCard) return

  const initialX = e.pageX ?? e.touches[0].pageX

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove, { passive: true })
  document.addEventListener('touchend', onEnd, { passive: true })


  function onMove(e) {
    const currentX = e.pageX ?? e.touches[0].pageX
    distance = currentX - initialX
    const deg = distance / 10

    if (distance === 0) return

    isAnimated = true

    actualCard.style.transform = `translateX(${distance}px) rotate(${deg}deg)`
    actualCard.style.cursor = 'grabbing'

    const opacity = Math.abs(distance) / 100
    const goRigth = distance > 0
    const choice = goRigth
      ? actualCard.querySelector('.choice.like')
      : actualCard.querySelector('.choice.nope')

    choice.style.opacity = opacity
  }

  function onEnd() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)

    const decisionMade = Math.abs(distance) >= DECISION

    if (decisionMade) {
      const goRigth = distance > 0

      actualCard.classList.add(goRigth ? 'go-rigth' : 'go-left')

      actualCard.addEventListener('transitionend', () => {
        actualCard.remove()
      })
    } else {
      actualCard.classList.add('reset')
      actualCard.classList.remove('go-rigth', 'go-left')
      actualCard
        .querySelectorAll('.choice')
        .forEach(choice => choice.style.opacity = 0)
    }

    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style')
      actualCard.classList.remove('reset')

      distance = 0
      isAnimated = false

    })

    actualCard
      .querySelectorAll('.choice')
      .forEach(choice => choice.style.opacity = 0)
  }
}

document.addEventListener('mousedown', starDrag)
document.addEventListener('touchstart', starDrag, { passive: true })