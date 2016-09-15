<?php

namespace BmsBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class BmsController extends Controller
{

    /**
     * @Route("/", name="bms_index")
     */
    public function bmsIndexAction()
    {

        return $this->render('BmsBundle::index.html.twig');
    }

    /**
     * @Route("/bms_change_page", name="bms_change_page", options={"expose"=true})
     * @param Request $request
     * @return JsonResponse
     */
    public function ajaxChangePageAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {

            $page_id = $request->get("page_id");
            if(empty($page_id)) {
                $page = $this->getDoctrine()->getRepository('VisualizationBundle:Page')->findMainPage();
                $page_id = $page->getId();
            }

            $ret['template'] = $this->container->get('templating')->render('BmsBundle:Pages:' . $page_id . '.html.twig');
            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @Route("/bms_refresh_page", name="bms_refresh_page", options={"expose"=true})
     * @param Request $request
     * @return JsonResponse
     */
    public function ajaxRefreshPageAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {
            $panelVariableRepo = $this->getDoctrine()->getRepository('VisualizationBundle:PanelVariable');
            $gadgetProgressBarRepo = $this->getDoctrine()->getRepository('VisualizationBundle:GadgetProgressBar');
            $pageRepo = $this->getDoctrine()->getRepository('VisualizationBundle:Page');
            $deviceRepo = $this->getDoctrine()->getRepository('BmsConfigurationBundle:Device');
            $technicalInformationRepo = $this->getDoctrine()->getRepository('BmsConfigurationBundle:TechnicalInformation');
            $page_id = $request->get("page_id");
            $ret['registers'] = $panelVariableRepo->findVariablePanelsRegistersForPage($page_id);
            $ret['progressbars'] = $gadgetProgressBarRepo->findForPage($page_id);
            $ret['hide_show_events'] = $pageRepo->findHideShowElements($page_id);
            $ret['devicesStatus'] = $deviceRepo->getDevicesStatus();
            $time = $technicalInformationRepo->getRpiStatus();
            $time ? $ret['state'] = $time[0]["time"]->getTimestamp() : $ret['state'] = null;
            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

}
