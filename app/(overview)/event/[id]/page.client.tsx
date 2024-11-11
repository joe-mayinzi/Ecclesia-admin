"use client";

import { ManagementEvent } from "@/app/lib/config/interface";
import { file_url, front_url } from "@/app/lib/request/request";
import { Button, Image, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import moment from "moment";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";



export default function EventByIdPageClient({ initData, session }: { initData: ManagementEvent, session: Session | null }) {
  const user = session ? session.user : null
  const router = useRouter()
  // const MerchantID = "47fb1c1fcf734ae99c3c41cb902e8604"
  // const MerchantPassword = "12b3ad17b499462292d064ef310ee178"
  // const url_back = "https://ecclesiabook.org/event/subcribe";
  // const gatWay = "https://api.maxicashapp.com/PayEntryPost" // Live


  {/* https://api.maxicashme.com/PayEntryPost Test */ }
  const MerchantID = "81a1c6e9175943d19a72250354871790";
  const MerchantPassword = "d8938074afca416398e5daca220e57d1";
  const url_back = `${front_url}event/subcribe/${initData.id}/`;
  const gatWay = "https://api-testbed.maxicashapp.com/PayEntryPost" //Test

  return <div>
    <Modal backdrop={"opaque"} isOpen={true} onClose={() => { router.push("/event") }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Résever
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col">
                <p className="text-xl">Voulez vous vraiment réservés pour cet événement</p>
                <p className="text-ellipsis line-clamp-1">{initData.name}</p>
                <p className="text-default-500 text-ellipsis text-sm">{initData.adressMap}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Image src={`${file_url}${initData.eglise.photo_eglise}`} width={20} height={20} className="rounded-full" />
                  <Link href={`@${initData.eglise.username_eglise}`} className="text-sm text-default-500">{initData.eglise.nom_eglise}</Link>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-default-500 text-sm">{initData.totalPerson} prs</p>
                  <p className="text-default-500 text-sm">{initData.isFree && "Gratuit"}</p>
                  <p className="text-default-500 text-sm">{!initData.isFree && initData.price + "USD"}</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              {user ?
                <div>
                  <form method="post" action={gatWay}>
                    <input type="hidden" name="PayType" value="MaxiCash" />
                    <input type="hidden" name="Amount" value={initData.price+"00"} />
                    <input type="hidden" name="Currency" value="USD" />
                    <input type="hidden" name="Telephone" value={user.telephone} />
                    <input type="hidden" name="Email" value={user.email} />
                    <input type="hidden" name="MerchantID" value={MerchantID} />
                    <input type="hidden" name="MerchantPassword" value={MerchantPassword} />
                    <input type="hidden" name="Language" value="fr" />
                    <input type="hidden" name="Reference" value={moment().unix()} />
                    <input type="hidden" name="notifyurl" value={url_back} />
                    <input type="hidden" name="accepturl" value={url_back} />
                    <input type="hidden" name="cancelurl" value={url_back} />
                    <input type="hidden" name="declineurl" value={url_back} />
                    <Button type="submit" className="text-white" color="primary">
                      Je veux résever mon billet
                    </Button>
                  </form>
                </div>
                :
                <Button as={Link} href="/api/auth/signin" variant="bordered">
                  Se connecter
                </Button>
              }
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </div>
}
