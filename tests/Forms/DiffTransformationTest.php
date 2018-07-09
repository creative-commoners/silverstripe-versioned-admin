<?php

namespace SilverStripe\VersionedAdmin\Tests\Forms;

use InvalidArgumentException;
use LogicException;
use SilverStripe\Control\Controller;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\VersionedAdmin\Forms\DiffTransformation;
use SilverStripe\View\ArrayData;

class DiffTransformationTest extends SapphireTest
{
    private $testData = [
        'First' => 'One',
        'Second' => 'Two',
        'Third' => 'Three',
    ];
    
    private $testForm;
    
    protected function setUp()
    {
        parent::setUp();
        
        $fields = FieldList::create();
        foreach ($this->testData as $fieldName => $fieldValue) {
            $fields->push(TextField::create($fieldName)->setValue($fieldValue));
        }
        $this->testForm = Form::create(
            Controller::create(),
            'TestForm',
            $fields,
            FieldList::create()
        );
        // Don't go injecting an extra field to the $fields FieldList
        $this->testForm->disableSecurityToken();
    }

    public function testSetComparisonData()
    {
        $transformation = new DiffTransformation();
        $testData = $this->testData;
        foreach ([
            $testData,
            DataObject::create($testData),
            ArrayData::create($testData)
        ] as $testInput) {
            $transformation->setComparisonData($testInput);
            $this->assertEquals($testData, $transformation->getComparisonData());
        }
        
        $this->expectException(InvalidArgumentException::class);
        
        $transformation->setComparisonData('First', '1st');
    }
    
    public function testSetComparisonDataMerge()
    {
        $transformation = new DiffTransformation([
            'First' => 'Once',
            'Second' => '2nd',
        ]);
        $transformation->setComparisonData([
            'Second' => 'Twice',
            'Third' => 'Thrice',
        ], $merge = true);
        // will throw an exception if not enough data is set
        $this->testForm->transform($transformation);
    }

    public function testTransform()
    {
        $form = $this->testForm;
        $update = [
            'First' => '1st',
            'Second' => '2nd',
            'Third' => '3rd',
        ];
        $expected = $this->getExpected($update);
        $transformation = DiffTransformation::create($update);
        $form->transform($transformation);
        foreach ($form->Fields() as $index => $field) {
            $this->assertEquals($expected[$index], $field->Value());
        }
    }
    
    public function testTransformWithNotEnoughData()
    {
        $form = $this->testForm;
        $transformation = DiffTransformation::create([
            'First' => '1st',
        ]);
        $this->expectException(LogicException::class);
        $form->transform($transformation);
    }
    
    public function testTransformWithCompositeFields()
    {
        $form = $this->testForm;
        $form->setFields(CompositeField::create($form->Fields()));
        $update = [
            'First' => 'Uno',
            'Second' => 'Dos',
            'Third' => 'Tres',
        ];
        $expected = $this->getExpected($update);
        $transformation = DiffTransformation::create($update);
        $form->transform($transformation);
        foreach (array_values($form->Fields()->dataFields()) as $index => $field) {
            $this->assertEquals($expected[$index], $field->Value());
        }
    }
    
    private function getExpected($update, $original = null)
    {
        $expected = [];
        $original = $original ?: $this->testData;
        foreach (array_combine(array_values($update), array_values($original)) as $now => $was) {
            $expected[] = "<ins>$now</ins> <del>$was</del>";
        }
        return $expected;
    }
}
