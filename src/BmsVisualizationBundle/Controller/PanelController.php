<?php

namespace BmsVisualizationBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;
use BmsVisualizationBundle\Entity\Panel;
use BmsVisualizationBundle\Entity\WidgetBar;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class PanelController extends Controller {

    /**
     * @Route("/load_panel_dialog", name="bms_visualization_load_panel_dialog", options={"expose"=true})
     */
    public function loadPanelDialogAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $options = array();
            
            $panelRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Panel');
            $panel_id = $request->get("panel_id");
            if (isset($panel_id)) {                
                $panel = $panelRepo->findOneById($panel_id);
                $options['panel'] = $panel;                
                
                $termRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Term');
                $terms = $termRepo->findAllForPanelAsObject($panel_id);
                $options['terms'] = $terms;
                
                if($panel->getType() === "variable"){
                    $reg_id = $panel->getContentSource();
                    $registerRepo = $this->getDoctrine()->getRepository('BmsConfigurationBundle:Register');
                    $register = $registerRepo->findOneById($reg_id);

                    $options['register'] = $register;
                    $r["name"] = $register->getName();
                    $r["value"] = $register->getRegisterCurrentData()->getFixedValue();
                    $ret["register"] = $r;
                }
            }
            $lastPanel = $panelRepo->findLastPanel();
            $newId = $lastPanel->getId();
            $options['newId'] = (int)($newId + 1);
            
            $pageRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Page');
            $pages = $pageRepo->findAll();
            $options['pages'] = $pages;
            
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
            $panelRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Panel');
            $page_id = $request->request->get("page_id");
            
            $em = $this->getDoctrine()->getManager();
            
            $panel = new Panel();
            $page = $pageRepo->find($page_id);
            $panel->setPage($page)
                    ->setName("new")
                    ->setType("new")
                    ->setTopPosition(0)
                    ->setLeftPosition(0)
                    ->setWidth(0)
                    ->setHeight(0)
                    ->setBorder("new")
                    ->setBackgroundColor("new")
                    ->setTextAlign("new")
                    ->setFontWeight("new")
                    ->setTextDecoration("new")
                    ->setFontStyle("new")
                    ->setFontFamily("new")
                    ->setFontSize(0)
                    ->setFontColor("new")
                    ->setBorderRadius("new")
                    ->setZIndex(0)
                    ->setVisibility(0)
                    ->setContentSource("new")
                    ->setDisplayPrecision(0)
                    ->setHref(NULL);

            $em->persist($panel);
            $em->flush();

            $ret["panel_id"] = $panel->getId();
            $panels = $panelRepo->findPanelsForPage($panel->getPage()->getId());
            $ret['panelList'] = $this->container->get('templating')->render('BmsVisualizationBundle::panelList.html.twig', ['panels' => $panels]);
            
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
            $progressBarRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:WidgetBar');
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
            $href = $request->request->get("href");
            
            $em = $this->getDoctrine()->getManager();
            $widgetArray = array();
            if ($type == "variable") {
                $registerName = $request->request->get("contentSource");
                $register = $registerRepo->findOneBy(array('name' => $registerName));
                $reg["id"] = $register->getId();
                $reg["value"] = $register->getRegisterCurrentData()->getFixedValue();
                $contentSource = $register->getId();
            } elseif( $type == "widget") {
                $progressBar = new WidgetBar();
                $setRegisterName = $request->request->get("pbRegSet");
                if($setRegisterName != NULL){
                    $setRegister = $registerRepo->findOneBy(array('name' => $setRegisterName));
                    $progressBar->setSetRegisterId($setRegister);
                }
                $valueRegister = $registerRepo->findOneBy(array('name' => $request->request->get("pbRegVal")));
                
                $rangeMin = $request->request->get("pbMin");
                $rangeMax = $request->request->get("pbMax");
                $optimumMin = $request->request->get("pbOptimumMin");
                $optimumMax = $request->request->get("pbOptimumMax");
                $color1 = $request->request->get("pbColor1");
                $color2 = $request->request->get("pbColor2");
                $color3 = $request->request->get("pbColor3");
                $progressBar->setValueRegisterId($valueRegister)
                        ->setRangeMin($rangeMin)
                        ->setRangeMax($rangeMax)
                        ->setOptimumMin($optimumMin)
                        ->setOptimumMax($optimumMax)
                        ->setColor1($color1)
                        ->setColor2($color2)
                        ->setColor3($color3);
                $em->persist($progressBar);
                $em->flush();
                array_push($widgetArray, $progressBar);
                $contentSource = $progressBar->getId();
            } else {
                $contentSource = $request->request->get("contentSource");
                $reg = null;
            }

            if ($request->request->get("visibility") == "true") {
                $visibility = 1;
            } else {
                $visibility = 0;
            }


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
                    ->setDisplayPrecision($displayPrecision)
                    ->setHref($href);

            $em->flush();
            $ret["panel_id"] = $panel_id;
            $ret["register"] = $reg;
            $ret["template"] = $this->container->get('templating')->render('BmsVisualizationBundle::panel.html.twig', ['panel' => $panel, 'widgets' => $widgetArray]);
            $panels = $panelRepo->findPanelsForPage($panel->getPage()->getId());
            $ret['panelList'] = $this->container->get('templating')->render('BmsVisualizationBundle::panelList.html.twig', ['panels' => $panels]);
            
            
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
            $zIndex = $request->get("zIndex");

            $panel->setHeight($height)
                    ->setWidth($width)
                    ->setLeftPosition($leftPosition)
                    ->setTopPosition($topPosition)
                    ->setZIndex($zIndex);

            $em->flush();

            $panels = $panelRepo->findPanelsForPage($panel->getPage()->getId());
            $ret['panelList'] = $this->container->get('templating')->render('BmsVisualizationBundle::panelList.html.twig', ['panels' => $panels]);
            
            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @Route("/copy_panel", name="bms_visualization_copy_panel", options={"expose"=true})
     */
    public function copyPanelAction(Request $request) {
        if ($request->isXmlHttpRequest()) {            
            $options = array();
            
            $panel_id = $request->get("panel_id");

            $em = $this->getDoctrine()->getManager();
            $panelRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Panel');
            $panel = $panelRepo->find($panel_id);
            
            if($panel->getType() === "variable"){
                $reg_id = $panel->getContentSource();
                $registerRepo = $this->getDoctrine()->getRepository('BmsConfigurationBundle:Register');
                $register = $registerRepo->findOneById($reg_id);

                $options['register'] = $register;
                $r["name"] = $register->getName();
                $r["value"] = $register->getRegisterCurrentData()->getFixedValue();
                $ret["register"] = $r;
            }
            
            $newPanel = clone $panel;

            $newPanel->setTopPosition(0)->setLeftPosition(0);

            $em->persist($newPanel);
            $em->flush();
            
            $pageRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Page');
            $pages = $pageRepo->findAll();
            $options['pages'] = $pages;
            
            $lastPanel = $panelRepo->findLastPanel();
            $newId = $lastPanel->getId();
            $options['newId'] = (int)($newId + 1);
            
            $ret["dialog"] = $this->container->get('templating')->render('BmsVisualizationBundle:dialog:panelDialog.html.twig', $options);
            
            $ret["panel_id"] = $newPanel->getId();
            $ret["template"] = $this->container->get('templating')->render('BmsVisualizationBundle::panel.html.twig', ['panel' => $newPanel]);
            
            $panels = $panelRepo->findPanelsForPage($panel->getPage()->getId());
            $ret['panelList'] = $this->container->get('templating')->render('BmsVisualizationBundle::panelList.html.twig', ['panels' => $panels]);
            
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
            $termRepo = $this->getDoctrine()->getRepository('BmsVisualizationBundle:Term');
            
            $panel = $panelRepo->find($panel_id);
            $terms = $termRepo->findAllForPanel($panel_id);
            
            foreach($terms as $term){
                $em->remove($term);
            }
            
            $em->remove($panel);
            $em->flush();

            $em->getConnection()->exec("ALTER TABLE panel AUTO_INCREMENT = 1;");
            $em->getConnection()->exec("ALTER TABLE term AUTO_INCREMENT = 1;");
            
            $panels = $panelRepo->findPanelsForPage($panel->getPage()->getId());
            $ret['panelList'] = $this->container->get('templating')->render('BmsVisualizationBundle::panelList.html.twig', ['panels' => $panels]);
            
            return new JsonResponse($ret);
        } else {
            throw new AccessDeniedHttpException();
        }
    }

}

