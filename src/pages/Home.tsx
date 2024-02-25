

const Home = () => {


    // Funktion für das smoothe Scrollen beim Button

    const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault(); 
      const targetId = e.currentTarget.getAttribute("href"); 
      if (targetId) {
          const targetElement = document.getElementById(targetId.slice(1)); 
          if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
          }
      }
  };


  return (
    <>
      <div className="home-headlines">
        <h1 className="home-headline">
          WELT<br></br>
          <span>FÜR</span><br></br>
          FOTOGRAFIE
        </h1>

        <h3 className="home-sub-headline"><div></div>Lass dich inspirieren<div></div></h3>
        <a href="#create-post-preview" className="home-scroll-down-btn" onClick={handleScrollClick}>
        <div className="scroll-down">
          <img src="../src/images/home/scroll-down.svg" alt="Scroll-Down" />
        </div>
      </a>
      </div>

      <img className="home-background-image" src="../src/images/home/home-background-image.png" />


      <div id="create-post-preview">
        <h2 className="home-section-headline">
          Teile deine Fotografie- <br></br>
          erfahrungen 📸
        </h2>
        <img src="../src/images/home/create-post-preview.png" />
      </div>

      <div id="comment-preview">
        <h2 className="home-section-headline">
          Tausche dich mit <br></br>
          anderen aus 💬
        </h2>
        <img src="../src/images/home/comment-preview.png" />
      </div>
    </>
  )
}

export default Home