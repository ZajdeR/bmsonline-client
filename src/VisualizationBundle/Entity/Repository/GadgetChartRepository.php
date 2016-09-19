<?php

namespace VisualizationBundle\Entity\Repository;

use Ob\HighchartsBundle\Highcharts\Highchart;

/**
 * GadgetChartRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class GadgetChartRepository extends \Doctrine\ORM\EntityRepository
{

    public function findForPage($page_id)
    {
        $data = self::findBy(['page' => $page_id]);
        $ret = [];

        foreach ($data as $element) {
            $id = $element->getId();

            $chart = new Highchart();
            $chart->global->useUTC(false);
            $chart->chart
                ->renderTo('chart_' . $id)
                ->backgroundColor('rgba(255, 255, 255, 0)')
                ->height($element->getHeight())
                ->margin([2, 2, 2, 2]);
            $chart->title->text(null);
            $chart->xAxis->title(null)
                ->type('datetime');
            $chart->yAxis->title(null);
            $chart->exporting->enabled(false);
            $chart->legend->enabled(false);
            $chart->credits->enabled(false);
            $chart->tooltip->enabled(false);

            $registerArchiveData = self::getArchiveData($element->getSource()->getId());
            $arrayToChart = array();
            foreach ($registerArchiveData as $rad) {
                $time = $rad["timeOfInsert"]->getTimestamp() * 1000;
                array_push($arrayToChart, [$time, $rad["fixedValue"]]);
            }
            $series = [
                'data' => $arrayToChart,
            ];

            $chart->series([$series]);
            $ret[$id] = $chart;
        }
        return $ret;

    }

    public function getArchiveData($registerId)
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT rad.timeOfInsert, rad.fixedValue '
                . 'FROM BmsConfigurationBundle:RegisterArchiveData AS rad '
                . 'WHERE rad.register = ' . $registerId
                . ' AND rad.timeOfInsert >= DATE_SUB(CURRENT_DATE(), 1, \'HOUR\')'
            )
            ->getResult();
    }

}
