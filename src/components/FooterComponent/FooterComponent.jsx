import './FooterComponent.css';

const TEAM_MEMBERS = ['Juan Blas Gonzalez Seijas', 'Valentin Lumbreras'];

function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <p>{TEAM_MEMBERS.join(' · ')}</p>
        <p>WALLy Street © {currentYear}</p>
      </div>
    </footer>
  );
}

export default FooterComponent;