import Hero from "../components/Hero";
import NavBar from "../components/NavBar"
import aboutImg from "../assets/2.jpg"
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";

function Contact (){
    return(
        <>
       <NavBar/>
        <Hero
        cName="hero-mid"
        heroImg={aboutImg}
        title="Contact"
        />
        <ContactForm/>
        <Footer/>
        </>
    )
}

export default Contact;