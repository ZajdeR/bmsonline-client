<?php

namespace BmsVisualizationBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;
use BmsVisualizationBundle\Entity\Panel;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class PanelController extends Controller {

    /**
     * @Route("/load_panel_dialog", name="bms_visualization_load_panel_dialog", options={"expose"=true})
     */
    public function loadPanelDialogAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $options = array();
            $reg_id = $request->get("reg_id");
            if (isset($reg_id)) {
                $registerRepo = $this->getDoctrine()->getRepository('BmsConfigurationBundle:Register');
                $register = $registerRepo->findOneById($reg_id);

                $options = array('registers' => $registers);
                $r["name"] = $register->getName();
                $r["value"] = $register->getRegisterCurrentData()->getFixedValue();
                $ret["register"] = $r;
            }
            $panel_id = $request->get("panel_id");
            if (isset($panel_id)) {
                $termRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Term');
                $terms = $termRepo->findAllForPanel($panel_id);
                $options = array('terms' => $terms);
            }
            $ret["template"] = $this->container->get('templating')->render('BmsVisualizationBundle:dialog:panelDialog.html.twig', $options);

            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @Route("/add_panel", name="bms_visualization_add_panel", options={"expose"=true})
     */
    public function addPanelAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $pageRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Page');
            $registerRepo = $this->getDoctrine()->getRepository('BmsConfigurationBundle:Register');

            $page_id = $request->request->get("page_id");
            $type = $request->request->get("type");
            $name = $request->request->get("name");
            $topPosition = $request->request->get("topPosition");
            $leftPosition = $request->request->get("leftPosition");
            $width = $request->request->get("width");
            $height = $request->request->get("height");
            $border = $request->request->get("border");
            $backgroundColor = $request->request->get("backgroundColor");
            $textAlign = $request->request->get("textAlign");
            $fontWeight = $request->request->get("fontWeight");
            $textDecoration = $request->request->get("textDecoration");
            $fontStyle = $request->request->get("fontStyle");
            $fontFamily = $request->request->get("fontFamily");
            $fontSize = $request->request->get("fontSize");
            $content_source = $request->request->get("content_source");
            $fontColor = $request->request->get("fontColor");
            $borderRadius = $request->request->get("borderRadius");
            $zIndex = $request->request->get("zIndex");
            $displayPrecision = $request->request->get("displayPrecision");
            if ($type == "variable") {
                $registerName = $request->request->get("contentSource");
                $register = $registerRepo->findOneBy(array('name' => $registerName));
                $contentSource = $register->getId();
            } else {
                $contentSource = $request->request->get("contentSource");
            }

            if ($request->request->get("visibility") == "true") {
                $visibility = 1;
            } else {
                $visibility = 0;
            }

            $em = $this->getDoctrine()->getManager();

            $panel = new Panel();
            $page = $pageRepo->find($page_id);
            $panel->setPage($page)
                    ->setName($name)
                    ->setType($type)
                    ->setTopPosition($topPosition)
                    ->setLeftPosition($leftPosition)
                    ->setWidth($width)
                    ->setHeight($height)
                    ->setBorder($border)
                    ->setBackgroundColor($backgroundColor)
                    ->setTextAlign($textAlign)
                    ->setFontWeight($fontWeight)
                    ->setTextDecoration($textDecoration)
                    ->setFontStyle($fontStyle)
                    ->setFontFamily($fontFamily)
                    ->setFontSize($fontSize)
                    ->setContentSource($content_source)
                    ->setFontColor($fontColor)
                    ->setBorderRadius($borderRadius)
                    ->setZIndex($zIndex)
                    ->setVisibility($visibility)
                    ->setContentSource($contentSource)
                    ->setDisplayPrecision($displayPrecision);

            $em->persist($panel);
            $em->flush();

            $ret["template"] = $this->container->get('templating')->render('BmsVisualizationBundle::panel.html.twig', ['panel' => $panel]);
            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @Route("/edit_panel", name="bms_visualization_edit_panel", options={"expose"=true})
     */
    public function editPanelAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $panelRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Panel');
            $registerRepo = $this->getDoctrine()->getRepository('BmsConfigurationBundle:Register');
            //get data
            $panel_id = $request->request->get("panel_id");
            $type = $request->request->get("type");
            $name = $request->request->get("name");
            $topPosition = $request->request->get("topPosition");
            $leftPosition = $request->request->get("leftPosition");
            $width = $request->request->get("width");
            $height = $request->request->get("height");
            $border = $request->request->get("border");
            $backgroundColor = $request->request->get("backgroundColor");
            $textAlign = $request->request->get("textAlign");
            $fontWeight = $request->request->get("fontWeight");
            $textDecoration = $request->request->get("textDecoration");
            $fontStyle = $request->request->get("fontStyle");
            $fontFamily = $request->request->get("fontFamily");
            $fontSize = $request->request->get("fontSize");
            $fontColor = $request->request->get("fontColor");
            $borderRadius = $request->request->get("borderRadius");
            $zIndex = $request->request->get("zIndex");
            $displayPrecision = $request->request->get("displayPrecision");
            if ($type == "variable") {
                $registerName = $request->request->get("contentSource");
                $register = $registerRepo->findOneBy(array('name' => $registerName));
                $contentSource = $register->getId();
            } else {
                $contentSource = $request->request->get("contentSource");
            }

            if ($request->request->get("visibility") == "true") {
                $visibility = 1;
            } else {
                $visibility = 0;
            }

            $em = $this->getDoctrine()->getManager();

            $panel = $panelRepo->find($panel_id);
            $panel->setName($name)
                    ->setType($type)
                    ->setTopPosition($topPosition)
                    ->setLeftPosition($leftPosition)
                    ->setWidth($width)
                    ->setHeight($height)
                    ->setBorder($border)
                    ->setBackgroundColor($backgroundColor)
                    ->setTextAlign($textAlign)
                    ->setFontWeight($fontWeight)
                    ->setTextDecoration($textDecoration)
                    ->setFontStyle($fontStyle)
                    ->setFontFamily($fontFamily)
                    ->setFontSize($fontSize)
                    ->setFontColor($fontColor)
                    ->setBorderRadius($borderRadius)
                    ->setZIndex($zIndex)
                    ->setVisibility($visibility)
                    ->setContentSource($contentSource)
                    ->setDisplayPrecision($displayPrecision);

            $em->flush();
            $ret["panel_id"] = $panel_id;
            $ret["template"] = $this->container->get('templating')->render('BmsVisualizationBundle::panel.html.twig', ['panel' => $panel]);
            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @Route("/move_panel", name="bms_visualization_move_panel", options={"expose"=true})
     */
    public function movePanelAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $em = $this->getDoctrine()->getManager();
            $panelRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Panel');
            $panel = $panelRepo->find($request->get("panel_id"));

            $height = $request->get("height");
            $width = $request->get("width");
            $topPosition = $request->get("topPosition");
            $leftPosition = $request->get("leftPosition");

            $panel->setHeight($height)
                    ->setWidth($width)
                    ->setLeftPosition($leftPosition)
                    ->setTopPosition($topPosition);

            $em->flush();

            return new JsonResponse();
        } else {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @Route("/copy_panel", name="bms_visualization_copy_panel", options={"expose"=true})
     */
    public function copyPanelAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $panel_id = $request->get("panel_id");

            $em = $this->getDoctrine()->getManager();
            $panelRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Panel');
            $panel = $panelRepo->find($panel_id);
            $newPanel = clone $panel;

            $newPanel->setTopPosition(0)->setLeftPosition(0);

            $em->persist($newPanel);
            $em->flush();

            $ret["panel_id"] = $newPanel->getId();
            $ret["dialog"] = $this->container->get('templating')->render('BmsVisualizationBundle:dialog:panelDialog.html.twig');
            $ret["template"] = $this->container->get('templating')->render('BmsVisualizationBundle::panel.html.twig', ['panel' => $newPanel]);
            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @Route("/delete_panel", name="bms_visualization_delete_panel", options={"expose"=true})
     */
    public function deletePanelAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $panel_id = $request->get("panel_id");

            $em = $this->getDoctrine()->getManager();
            $panelRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Panel');
            $panel = $panelRepo->find($panel_id);

            $em->remove($panel);
            $em->flush();

            $em->getConnection()->exec("ALTER TABLE panel AUTO_INCREMENT = 1;");
            return new JsonResponse();
        } else {
            throw new AccessDeniedHttpException();
        }
    }

}
