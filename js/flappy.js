function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const b = new Barreira(true)
//b.setAltura(200)
// document.querySelector('[yf-flappy]').appendChild(b.elemento)

function parDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)
    
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)

}

//const b = new parDeBarreiras(500, 200, 400)
//document.querySelector('[yf-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new parDeBarreiras(altura,abertura,largura),
        new parDeBarreiras(altura,abertura,largura + espaco),
        new parDeBarreiras(altura,abertura,largura + espaco * 2),
        new parDeBarreiras(altura,abertura,largura + espaco * 3),
        
    ]

    const descolacamento = 3
    this.animar = () => {
        this.pares.forEach(par =>{
            par.setX(par.getX() - descolacamento)
        
        // Quando o elemento sair da área do jogo

        if (par.getX() < -par.getLargura()){
            par.setX(par.getX() + espaco * this.pares.length)
            par.sortearAbertura()
        }

        const meio = largura / 2
        const cruzouOmeio = par.getX() + descolacamento >= meio
           && par.getX() < meio
           if(cruzouOmeio)notificarPonto()

        })
    }
  
}

function Passaro(alturaDoJogo){
    let voando = false
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'
    
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
            const novoY = this.getY() + (voando ? 8 : -5)
            const alturaMaxima = alturaDoJogo - this.elemento.clientHeight

            if (novoY <= 0) {
                this.setY = (0)
            }
            else if (novoY >= alturaMaxima){
            this.setY =(alturaMaxima)
        }
            else {
                this.setY(novoY)
            }
    }

this.setY(alturaDoJogo / 2)

}

const barreiras = new Barreiras(700,1100,200,400)
const passaro = new Passaro (700)
const areaDoJogo = document.querySelector('[yf-flappy]')


function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos 
    }
    this.atualizarPontos(0)
}

function estaoSobrepostos(elementoA, elementoB){
   const a = elementoA.getBoundingClientRect()
   const b = elementoB.getBoundingClientRect()

      const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical =  a.top + a.height >= b.top && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras){
  let colidiu = false

  barreiras.pares.forEach(parDeBarreiras => {
      if(!colidiu){
          const superior = parDeBarreiras.superior.elemento
          const inferior = parDeBarreiras.inferior.elemento
          colidiu = estaoSobrepostos(passaro.elemento, superior)
          || estaoSobrepostos(passaro.elemento, inferior)
      }
  })

  return colidiu

    }


function FlappyBird() {
      let pontos = 0


      const areaDoJogo = document.querySelector('[yf-flappy]')
         const altura = areaDoJogo.clientHeight
         const  largura = areaDoJogo.clientWidth

         const progresso = new Progresso()
         const barreiras = new Barreiras(altura, largura, 200, 400,
            ()  =>progresso.atualizarPontos(++pontos)
           
         )

         const passaro = new Passaro(altura)

         areaDoJogo.appendChild(progresso.elemento)
         areaDoJogo.appendChild(passaro.elemento)
         barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

         
         const gameOver = document.getElementById('gm')
         const pontuação = document.getElementById('pontuação')
         pontuação.textContent = `Pontuação: ${pontos}`
        

       

         this.start = () => {
               //loop do jogo
               
                
               const temporizador = setInterval(() =>{
                   barreiras.animar()
                   passaro.animar()
                
                   if(colidiu(passaro, barreiras)){
                       clearInterval(temporizador)

                     areaDoJogo.style.display= 'none' 
                     gameOver.style.display = 'flex'
                     pontuação.textContent = `Pontuação: ${progresso.elemento.textContent}`
                    
                   }

               }, 20 )

         }

}   

new FlappyBird().start()