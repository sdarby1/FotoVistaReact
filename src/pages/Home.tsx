const Home = () => {
    const handleScrollClick = (e) => {
      e.preventDefault(); // Verhindert die Standard-Linkaktion
      const targetId = e.currentTarget.getAttribute("href").slice(1); // Entfernt das #, um die ID zu bekommen
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Verwendet scrollIntoView, um zum Ziel-Element zu scrollen
        targetElement.scrollIntoView({ behavior: 'smooth' });
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
      </div>

      <img className="home-background-image" src="../src/images/home/home-background-image.png" />

      <a href="#create-post-preview" className="home-scroll-down-btn" onClick={handleScrollClick}>
        <div className="scroll-down">
          <img src="../src/images/home/scroll-down.svg" alt="Scroll-Down" />
        </div>
      </a>

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