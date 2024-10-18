"use client";

import { createSubscribeInEventApi } from "@/app/lib/actions/management/event/event.req";
import { ManagementEvent } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import { Button, Image, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import moment from "moment";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";



export default function EventByIdPageClient({ initData, session }: { initData: ManagementEvent, session: Session | null }) {
  const user = session ? session.user : null
  const router = useRouter()
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reference = searchParams.get("reference");
  const Method = searchParams.get("Method");

  const handleCreateSubscribeInEventApit = async () => {
    if (Method !== null && reference !== null && status === "success") {
      const abonnement = await createSubscribeInEventApi({
        paymentMothod: Method,
        paymentReference: reference,
      }, initData.id);

      if (abonnement.hasOwnProperty("statusCode") === 401) {
        router.push("/event")
      } else {
        router.push("/event")
      }
    } else {
      router.push("/event")
    }
  };
  handleCreateSubscribeInEventApit()

  return <div>
    <Modal backdrop={"opaque"} isOpen={true} onClose={() => { }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Réservation
            </ModalHeader>
            <ModalBody>
              {status === "success" ?
                <div className="flex flex-col">
                  <p className="text-xl">Votre reservation se bien passer</p>
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
                :
                <div>
                  <p className="text-xl">Une erreur se produit lors du payement de votre réservation.</p>
                  <p className="text-xl">Voulez-vous réessayer</p>
                </div>
              }
            </ModalBody>
            <ModalFooter>
              {status === "success" ?
                <Button as={Link} href="/event" variant="bordered">
                  OK
                </Button> :
                <Button as={Link} href={`/event/${initData.id}`} variant="bordered">
                  Réessayer
                </Button>
              }
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </div>
}
