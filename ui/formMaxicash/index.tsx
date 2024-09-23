/* eslint-disable react/no-unescaped-entities */
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import moment from "moment";
{
  /* https://api.maxicashme.com/PayEntryPost Live */
}
// const MerchantID = "47fb1c1fcf734ae99c3c41cb902e8604";
// const MerchantPassword = "12b3ad17b499462292d064ef310ee178";
// const url_back = "https://ecclesiabook.org/auth/payementResponse";
// const gatWay = "https://api.maxicashapp.com/PayEntryPost"; // Live

{
  /* https://api.maxicashme.com/PayEntryPost Test */
}
// const  MerchantID = "81a1c6e9175943d19a72250354871790";
// const  MerchantPassword = "d8938074afca416398e5daca220e57d1";
// const url_back = "http://localhost:3000/auth/payementResponse";
// const gatWay = "https://api-testbed.maxicashapp.com/PayEntryPost" //Test

export function PayementAbonnement({}: { telephone: string; email: string }) {
  return (
    <div>
      <div>
        <p>
          {" "}
          EcclesiaBook est un réseau social évangélique qui a pour but de parler
          de Jésus-Christ a toute le monde. De ce fait voici ce en qui nous
          croyons :
        </p>
        <p>
          - À l'Écriture Sainte, telle qu'elle a été donnée par Dieu à son
          origine, divinement inspirée, infaillible, entièrement digne de
          confiance, autorité souveraine en matière de foi et de vie ;
        </p>

        <p>
          {" "}
          - En un seul Dieu manifesté en trois personnes de toute éternité,
          Père, Fils, et Saint-Esprit ;
        </p>

        <p>
          - En Jésus-Christ, notre Seigneur, Dieu fait homme, né de la vierge
          Marie, à son humanité exempte de péché, ses miracles divins, sa mort
          expiatoire et substitutive, sa résurrection corporelle, son ascension,
          son œuvre médiatrice et son retour personnel dans la puissance et la
          gloire ;
        </p>

        <p>
          - Au salut de l'homme perdu et pécheur, grâce au sang versé par
          Jésus-Christ notre Seigneur. Ce salut est obtenu non par les œuvres,
          mais seulement par la foi. À la régénération par le Saint-Esprit ;
        </p>

        <p>
          - Au Saint-Esprit, qui habite le croyant, le rendant capable de vivre
          dans la sainteté, de témoigner et de travailler pour Jésus-Christ.
          Nous croyons que le baptême dans l'Esprit-Saint est une promesse pour
          les chrétiens de tous les siècles ; il est donné par le Père et le
          Fils, et il est manifesté par le parler en langues comme au jour de la
          Pentecôte, selon le récit du Nouveau Testament. Nous croyons aux dons
          spirituels (ou charismes) cités dans les Écritures, et que le
          Saint-Esprit accorde à l'Église, pour secourir et construire sa piété
          ;
        </p>

        <p>
          - À l'unité de l'esprit de tous les croyants, l'Église, le corps de
          Christ. Nous croyons que l'église locale est l'expression visible de
          l'Église universelle qui est le corps de Christ, et qui ne peut être
          délimitée par les dénominations religieuses de la chrétienté. Nous
          croyons que la prière pour la guérison des malades est une mission de
          l'Église qui est associée à la prédication de l'évangile. Nous croyons
          que c'est la volonté de Dieu de sauver, guérir et délivrer tous les
          hommes ;
        </p>

        <p>
          - À la résurrection des sauvés et des perdus ; les sauvés pour la vie
          éternelle, les perdus pour la damnation éternelle.
        </p>
      </div>
      {/* <form method="post" action={gatWay}>
      <input type="hidden" name="PayType" value="MaxiCash" />
      <input type="hidden" name="Amount" value="5999" />
      <input type="hidden" name="Currency" value="USD" />
      <input type="hidden" name="Telephone" value={telephone} />
      <input type="hidden" name="Email" value={email} />
      <input type="hidden" name="MerchantID" value={MerchantID} />
      <input type="hidden" name="MerchantPassword" value={MerchantPassword} />
      <input type="hidden" name="Language" value="fr" />
      <input type="hidden" name="Reference" value={moment().unix()} />
      <input type="hidden" name="notifyurl" value={url_back} />
      <input type="hidden" name="accepturl" value={url_back} />
      <input type="hidden" name="cancelurl" value={url_back} />
      <input type="hidden" name="declineurl" value={url_back} />
      <Button
        type="submit"
        size='lg'
        className="bg-primary text-white mt-2"
      >Abonnez-vous</Button>
    </form> */}
      <Button
        as={Link}
        className="bg-primary text-white mt-2"
        href={`auth/payementResponse?status=success&reference=${moment().unix()}&Method=FREE`}
        size="lg"
        type="submit"
      >
        Abonnez-vous
      </Button>
    </div>
  );
}
